import * as migration_20261012_102938_initial from './20261012_102938_initial';
import * as migration_20261012_175527_media_s3_objectkey from './20261012_175527_media_s3_objectkey';
import * as migration_20261012_183246_contenu_payload from './20261012_183246_contenu_payload';
import * as migration_20261012_184549_retrait_textes from './20261012_184549_retrait_textes';
import * as migration_20261012_184555_textes_par_section from './20261012_184555_textes_par_section';
import * as migration_20261012_205136_titres_google from './20261012_205136_titres_google';
import * as migration_20261123_104124_referencement_roles_formulaires from './20261123_104124_referencement_roles_formulaires';

export const migrations = [
  {
    up: migration_20261012_102938_initial.up,
    down: migration_20261012_102938_initial.down,
    name: '20261012_102938_initial',
  },
  {
    up: migration_20261012_175527_media_s3_objectkey.up,
    down: migration_20261012_175527_media_s3_objectkey.down,
    name: '20261012_175527_media_s3_objectkey',
  },
  {
    up: migration_20261012_183246_contenu_payload.up,
    down: migration_20261012_183246_contenu_payload.down,
    name: '20261012_183246_contenu_payload',
  },
  {
    up: migration_20261012_184549_retrait_textes.up,
    down: migration_20261012_184549_retrait_textes.down,
    name: '20261012_184549_retrait_textes',
  },
  {
    up: migration_20261012_184555_textes_par_section.up,
    down: migration_20261012_184555_textes_par_section.down,
    name: '20261012_184555_textes_par_section',
  },
  {
    up: migration_20261012_205136_titres_google.up,
    down: migration_20261012_205136_titres_google.down,
    name: '20261012_205136_titres_google',
  },
  {
    up: migration_20261123_104124_referencement_roles_formulaires.up,
    down: migration_20261123_104124_referencement_roles_formulaires.down,
    name: '20261123_104124_referencement_roles_formulaires'
  },
];
