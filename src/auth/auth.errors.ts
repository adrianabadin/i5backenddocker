export abstract class AuthError extends Error {
  public text: string
  constructor (public errorContent?: any, public message: string = 'Error de autenticacion', public code: number = 1000) {
    super(message)
    this.text = message
    this.name = 'Auth Error'
    this.code = code
  }
}

export class UserCreateError extends AuthError {
  constructor (errorContent?: any, message: string = 'Error al crear el usuario', code: number = 1001) {
    super(errorContent, message, code)
  }
}
export class UserExistsError extends AuthError {
  constructor (errorContent?: any, message = 'El usuario ya existe', code = 1002) {
    super(errorContent, message, code)
  }
}


export class UserNotAuthenticated extends AuthError {
  constructor (errorContent?: any, message = 'El usuario no se ha autenticado', code = 1003) {
    super(errorContent, message, code)
  }
}
export class TokenExpiredError extends AuthError {
  constructor (errorContent?: any, message:string = 'La Session expiro debes volver a iniciar session', code:number = 1004) {
    super(errorContent, message, code)
  }
}
export class TokenUndefinedError extends AuthError {
  constructor (errorContent?: any, message:string = 'El Usuario no ha Ingresado', code:number = 1005) {
    super(errorContent, message, code)
  }
}
export class JWTLoginError extends AuthError {
  constructor (errorContent?: any, message:string = 'Error al persistir session vuelva a iniciar session', code:number = 1005) {
    super(errorContent, message, code)
  }
}
export class PasswordMissMatchError extends AuthError {
  constructor (errorContent?: any, message = 'El usuario y contraseña no coinciden', code = 1005) {
    super(errorContent, message, code)
  }
}
export class UserDoesntExistError extends AuthError {
  constructor (errorContent?: any, message = 'El usuario NO existe', code = 1006) {
    super(errorContent, message, code)
  }}

  export class LocalLoginError extends AuthError {
    constructor (errorContent?: any, message = 'Error al ingresar', code = 1007) {
      super(errorContent, message, code)
    }}