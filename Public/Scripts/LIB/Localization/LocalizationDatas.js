// Lib Lens Atomic : Localization Datas
// Version : 1.0.0
// Dependencies : None
// Authors : Gautier Jacquet

//Doc : https://www.notion.so/atomicdigitaldesign/Localization-Module-064acc6c7c4747f5b03fb79bd1a5ae7f


// Obligatoire, le code de la langue pour cette instance de LocalizationDatas
//@input string language

// Obligatoire, le tableau contenant les textes.
// L'ordre des textes est important,
// à mettre dans le même ordre que les IDs sur le Localization Module.
//@input string[] texts

// Obligatoire, le tableau contenant les textures.
// L'ordre des textures est important,
// à mettre dans le même ordre que les IDs sur le Localization Module.
//@input Asset.Texture[] textures

// On peut rajouter des infos supplémentaires ici

// Il faut ensuite les rentrer dans ce tableau, en respectant l'ordre pour les IDs
// de la même manière que pour les textes et textures.
// Le tableau peut rester vide.
var extras = [];

// On appel ensuite la création du dataset.
// La fonction prend l'id de la langue ainsi que les trois tableaux de données.
// script.api.localizationDatas est obligatoire, le module se réfère à cette variable api.
script.api.localizationDatas = new global.LocalizationDatas(script.language, script.texts, script.textures, extras);
