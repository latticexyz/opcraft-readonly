import { BlockTypeKey } from "../layers/network/constants";
import { Textures } from "../layers/noa/constants";

export const gameTiles: Record<BlockTypeKey, string | null> = {
  Air: null,
  Grass: Textures.Grass,
  Dirt: Textures.Dirt,
  Log: Textures.LogTop,
  Stone: Textures.Stone,
  Sand: Textures.Sand,
  Glass: Textures.Glass,
  Water: Textures.Water,
  Cobblestone: Textures.Cobblestone,
  MossyCobblestone: Textures.MossyCobblestone,
  Coal: Textures.Coal,
  Crafting: Textures.Crafting,
  Iron: Textures.Iron,
  Gold: Textures.Gold,
  Diamond: Textures.Diamond,
  Leaves: Textures.Leaves,
  Planks: Textures.Planks,
  RedFlower: Textures.RedFlower,
  GrassPlant: Textures.GrassPlant,
  OrangeFlower: Textures.OrangeFlower,
  MagentaFlower: Textures.MagentaFlower,
  LightBlueFlower: Textures.LightBlueFlower,
  LimeFlower: Textures.LimeFlower,
  PinkFlower: Textures.PinkFlower,
  GrayFlower: Textures.GrayFlower,
  LightGrayFlower: Textures.LightGrayFlower,
  CyanFlower: Textures.CyanFlower,
  PurpleFlower: Textures.PurpleFlower,
  BlueFlower: Textures.BlueFlower,
  GreenFlower: Textures.GreenFlower,
  BlackFlower: Textures.BlackFlower,
  Kelp: Textures.Kelp,
  Wool: Textures.Wool,
  OrangeWool: Textures.OrangeWool,
  MagentaWool: Textures.MagentaWool,
  LightBlueWool: Textures.LightBlueWool,
  YellowWool: Textures.YellowWool,
  LimeWool: Textures.LimeWool,
  PinkWool: Textures.PinkWool,
  GrayWool: Textures.GrayWool,
  LightGrayWool: Textures.LightGrayWool,
  CyanWool: Textures.CyanWool,
  PurpleWool: Textures.PurpleWool,
  BlueWool: Textures.BlueWool,
  BrownWool: Textures.BrownWool,
  GreenWool: Textures.GreenWool,
  RedWool: Textures.RedWool,
  BlackWool: Textures.BlackWool,
  Sponge: Textures.Sponge,
  Snow: Textures.Snow,
  Clay: Textures.Clay,
  Bedrock: Textures.Bedrock,
  Bricks: Textures.Bricks,
};

export const heightTiles = {
  "-1": "rgba(0, 0, 0, 0.05)",
  "-2": "rgba(0, 0, 0, 0.10)",
  "-3": "rgba(0, 0, 0, 0.15)",
  "-4": "rgba(0, 0, 0, 0.20)",
  "-5": "rgba(0, 0, 0, 0.25)",
  "-6": "rgba(0, 0, 0, 0.30)",
  "-7": "rgba(0, 0, 0, 0.35)",
  "-8": "rgba(0, 0, 0, 0.40)",
  "1": "rgba(255, 255, 255, 0.05)",
  "2": "rgba(255, 255, 255, 0.10)",
  "3": "rgba(255, 255, 255, 0.15)",
  "4": "rgba(255, 255, 255, 0.20)",
  "5": "rgba(255, 255, 255, 0.25)",
  "6": "rgba(255, 255, 255, 0.30)",
  "7": "rgba(255, 255, 255, 0.35)",
  "8": "rgba(255, 255, 255, 0.40)",
};
