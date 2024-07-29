import { Prisma } from "@prisma/client"
import { ColumnPrismaError, NotFoundPrismaError, UniqueRestraintError, UnknownPrismaError } from "../Services/prisma.errors"

export abstract class PostError extends Error{
public errorContent:any
public code:string
public text:string
    constructor(errorContent?:any,message:string='Generic Post Error',code:string='PE-0000'  ){
    super(message)
    this.name='Post Error:'
    this.errorContent=errorContent
    this.code=code
    this.text=this.name+' '+message
}

}
export class FileMissingError extends PostError{
    constructor(errorContent?:any,message:string='Debes enviar un archivo',code:string='PE-0001'  ){
        super(errorContent,message,code)
        this.name='File Missing Error'
        
    }
}
export class AddAudioError extends PostError{
    constructor(errorContent?:any,message:string='Error al agregar el archivo',code:string='PE-0002'  ){
        super(errorContent,message,code)
        this.name='Add Audio Error'
        
    }

}
export function ValidatePrismaError(error:Prisma.PrismaClientKnownRequestError){
    switch (error.code) {
        case 'P2002':
          return new UniqueRestraintError(error, error.meta)
        case 'P2000':
          return new ColumnPrismaError(error, error.meta)
        case 'P2001':
          return new NotFoundPrismaError(error, error.meta)
        default:
          return new UnknownPrismaError(error, error.meta)
      }


}
export class MissingParamError extends PostError{
  constructor(errorContent?:any,message:string='Falta el parametro',code:string='PE-0003'  ){
      super(errorContent,message,code)
      this.name='Param missing Error'
      
  }
}