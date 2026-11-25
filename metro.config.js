// Expo Go may resolve the monorepo root as its Metro project root.
const {getDefaultConfig}=require('expo/metro-config');
const config=getDefaultConfig(__dirname);
if(!config.resolver.assetExts.includes('glb'))config.resolver.assetExts.push('glb');
module.exports=config;
