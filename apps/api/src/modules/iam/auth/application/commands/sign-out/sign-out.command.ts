export class SignOutCommand {
  constructor(public readonly refreshToken: string | null) {}
}
