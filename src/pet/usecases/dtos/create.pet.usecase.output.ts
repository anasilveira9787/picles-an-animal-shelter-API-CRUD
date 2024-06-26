export default class CreatePetUseCaseOutput {
  id: string;
  name: string;
  type: string;
  size: string;
  gender: string;
  photo: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<CreatePetUseCaseOutput>){
    Object.assign(this, data)
  }
}

