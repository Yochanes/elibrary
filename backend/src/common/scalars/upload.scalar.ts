import { GraphQLScalarType } from 'graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Scalar } from '@nestjs/graphql';

@Scalar('Upload')
export class UploadScalar {
  description = 'The `Upload` scalar type represents a file upload.';

  parseValue(value: any) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value: any) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast: any) {
    return GraphQLUpload.parseLiteral(ast);
  }
} 