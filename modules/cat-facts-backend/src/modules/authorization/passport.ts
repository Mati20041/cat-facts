import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, VerifyCallbackWithRequest } from 'passport-jwt';
import { SECRET } from '../../consts';
import { allowedTokenRepository } from './AllowedTokenRepository';

const jwtExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();

export const verify: VerifyCallbackWithRequest = async (request, payload, done) => {
  const jwtToken = jwtExtractor(request);
  const isTokenAllowed =
    jwtToken != null ? await allowedTokenRepository.isTokenAllowed(jwtToken) : false;
  if (isTokenAllowed) {
    done(null, payload);
  } else {
    done(null, false);
  }
};
passport.use(
  new JwtStrategy(
    {
      secretOrKey: SECRET,
      jwtFromRequest: jwtExtractor,
      passReqToCallback: true,
    },
    verify
  )
);

export const jwtAuthentication = passport.authenticate('jwt', { session: false });
