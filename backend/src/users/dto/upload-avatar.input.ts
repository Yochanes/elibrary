import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UploadAvatarInput {
  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
} 