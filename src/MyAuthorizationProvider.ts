import {UserRepository} from '@loopback/authentication-jwt';
import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';

export class MyAuthorizationProvider implements Provider<Authorizer> {
  /**
   * @returns an authorizer function
   *
   */
  constructor(@repository(UserRepository) protected userRepository: UserRepository){

  }
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    var user = await this.userRepository.findById(context.principals[0].id);
    if(metadata.allowedRoles?.includes(user["role"])){
      return AuthorizationDecision.ALLOW;
    } else {
      return AuthorizationDecision.DENY;
    }
  }
}
