// @flow

import type { Models } from 'flowTypes';
import _ from 'lodash';

function canIgnorePrivacy (character, email, ignorePrivacy) {
  return ignorePrivacy && email === character.Gw2ApiToken.User.email;
}

type ListOptions = {
  email?: string,
  alias?: string,
  guild?: string,
  ignorePrivacy?: boolean,
};

// eslint-disable-next-line
export async function list (models: Models, {
  email,
  alias,
  guild,
  ignorePrivacy,
}: ListOptions) {
  const characters = await models.Gw2Character.findAll({
    where: _.pickBy({
      guild,
    }),
    include: [{
      model: models.Gw2ApiToken,
      include: [{
        model: models.User,
        where: _.pickBy({
          email,
          alias,
        }),
      }],
    }],
  });

  return characters.filter((character) => (
    character.showPublic || canIgnorePrivacy(character, email, ignorePrivacy))
  )
  .map((c) => {
    return {
      accountName: c.Gw2ApiToken.accountName,
      userAlias: c.Gw2ApiToken.User.alias,
      world: c.Gw2ApiToken.world,
      name: c.name,
      gender: c.gender,
      profession: c.profession,
      level: c.level,
      race: c.race,
    };
  });
}

export async function listPublic (models: Models) {
  return models.Gw2Character.findAll({
    where: {
      showPublic: true,
    },
  });
}
