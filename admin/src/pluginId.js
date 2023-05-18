import pluginPkg from '../../package.json';

const pluginId = pluginPkg.displayName.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, '');

export default pluginId;
