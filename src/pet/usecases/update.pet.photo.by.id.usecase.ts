import { IUseCase } from "src/domain/iusecase.interface"
import UpdatePetPhotoByIdUseCaseInput from "./dtos/update.pet.photo.by.id.usecase.input"
import UpdatePetPhotoByIdUseCaseOutput from "./dtos/update.pet.photo.by.id.usecase.output"
import PetTokens from "../pet.tokens"
import { Inject } from "@nestjs/common"
import IPetRepository from "../interfaces/pet.repository.interface"
import { Pet } from "../schemas/pet.schema"
import PetNotFoundError from "src/domain/errors/pet.not.found.error"
import fileService from "src/file.service"
import IFileService from "src/interfaces/file.service.interface"
import { AppTokens } from "src/app.tokens"

export default class UpdatePetPhotoByIdUseCase implements IUseCase<UpdatePetPhotoByIdUseCaseInput, UpdatePetPhotoByIdUseCaseOutput> {

  constructor(
    @Inject(PetTokens.petRepository)
    private readonly petRepository: IPetRepository,

    @Inject(AppTokens.fileService)
    private readonly fileService: IFileService
  ) { }

  async run(input: UpdatePetPhotoByIdUseCaseInput): Promise<UpdatePetPhotoByIdUseCaseOutput> {
    const pet = await this.getPetById(input.id)

    if (!pet) {
      throw new PetNotFoundError()
    }

    await this.petRepository.updateById({
      _id: input.id,
      photo: input.photoPath,
    });

    const photo = await this.fileService.readFile(input.photoPath)

    return new UpdatePetPhotoByIdUseCaseOutput({
      id: pet._id,
      name: pet.name,
      type: pet.type,
      size: pet.size,
      gender: pet.gender,
      bio: pet.bio,
      photo: photo.toString('base64'),
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    });
  }

  private async getPetById(id: string): Promise<Pet> {
    try {
      return await this.petRepository.getById(id)
    } catch (error) {
      return null
    }
  }
}