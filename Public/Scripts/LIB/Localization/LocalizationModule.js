// Lib Lens Atomic : Localization Module
// Version : 1.0.0
// Dependencies : None
// Authors : Gautier Jacquet

//Doc : https://www.notion.so/atomicdigitaldesign/Localization-Module-064acc6c7c4747f5b03fb79bd1a5ae7f


// List of languages as used in lens studio :
// English (default) en
// Arabic ar
// Bengali (Bangladesh) bn-BD
// Bengali (India) bn-IN
// Chinese (Simplified) zh-Hans
// Chinese (Traditional) zh-Hant
// Danish da
// Dutch nl
// English (UK) en-GB
// Filipino fil
// Finnish fi
// French fr
// German de
// Greek el
// Gujarati gu
// Hindi hi
// Indonesian id
// Italian it
// Japanese ja
// Kannada kn
// Korean ko
// Malay ms
// Malayalam ml
// Marathi mr
// Norwegian nb
// Polish pl
// Portugese (Brazil) pt
// Portugese (Portugal) pt-PT
// Punjabi pa
// Romanian ro
// Russian ru
// Spanish (Argentina) es-AR
// Spanish (International) es
// Spanish (Mexico) es-MX
// Spanish (Spain) es-ES
// Swedish sv
// Tamil ta
// Telugu te
// Thai th
// Turkish tr
// Urdu ur
// Vietnamese vi


//#region Inputs
// List of inputs, they are simple string IDs for different texts, textures and extra infos.
//@input string[] textsIds
//@input string[] texturesIds
//@input string[] extrasIds
//#endregion


//#region Setup
// Stored localization objects.
var localizedTexts = [];
var localizedTextures = [];
var localizedExtras = [];

// For each ID existing we create a localization object.
for (var i = 0; i < script.textsIds.length; ++i)
{
    localizedTexts.push(new LocalizedFunction(script.textsIds[i]));
}

for (var i = 0; i < script.texturesIds.length; ++i)
{
    localizedTextures.push(new LocalizedFunction(script.texturesIds[i]));
}

for (var i = 0; i < script.extrasIds.length; ++i)
{
    localizedExtras.push(new LocalizedFunction(script.extrasIds[i]));
}

// Generation of the localization system.
global.Localization = new LocalizationClass(script.getSceneObject(), localizedTexts, localizedTextures, localizedExtras);


// startEvent to delay the data collection.
var startEvent = script.createEvent("OnStartEvent");
startEvent.bind(Setup);

function Setup ()
{
    global.Localization.GetLanguagesDatas();
    global.Localization.SetLanguage();
}
//#endregion


//#region Data structure
// A language data collection, set with an ID and an array for texts, textures and extra info.
// In each array, datas must be in the same order as the input IDs.
global.LocalizationDatas = function (_langId, _texts, _textures, _extras)
{
    //#region private vars
    this._langId = _langId; // Id of the language.
    this._texts = _texts; // All texts.
    this._textures = _textures; // All textures.
    this._extras = _extras; // All other information potentially needed.
    //#endregion

    //#region public functions
    // Getter for the language ID.
    this.GetId = function ()
    {
        return this._langId;
    }

    // Getter for text localization
    this.GetText = function (id)
    {
        return this._texts[id];
    }

    // Getter for texture localization
    this.GetTexture = function (id)
    {
        return this._textures[id];
    }

    // Getter for extra information localization
    this.GetExtra = function (id)
    {
        return this._extras[id];
    }
    //#endregion
}
//#endregion


//#region Localization structures
// Structure for external object to be localized.
function LocalizedObject (_parent, _callback)
{
    this._parent = _parent; // SceneObject using the localization.
    this._callback = _callback; // Function called to apply the localization.
}


// Internal structure to create a link between localizedObjects and localizationDatas.
function LocalizedFunction (_id)
{
    //#region private var
    var _this = this; // accessor to avoid scope problems.
    this._id = _id; // id of the localization, used by objects to refer to the proper data.
    this._localizedObjects = []; // array of all objects associated to this id.
    this._currentData = null; // data storage.
    //#endregion

    //#region public functions
    // Add a new object associated with the _id of the function.
    this.Add = function (_parent, _callback)
    {
        this._localizedObjects.push(new LocalizedObject(_parent, _callback));
        if (this._currentData != null)
        {
            _callback(this._currentTex);
        }
    }

    // Simple getter, used to find and compare IDs.
    this.GetId = function ()
    {
        return this._id;
    }

    // Function called to update the localization data associated with this id.
    this.Localize = function (_data)
    {
        this._currentData = _data;
        for (var i = 0; i < this._localizedObjects.length; ++i)
        {
            var obj = this._localizedObjects[i];
            if (obj._parent === null || obj._parent === undefined)
            {
                this._localizedObjects.splice(i, 1);
                i--;
            }
            else
            {
                obj._callback(_this._currentData);
            }
        }
    }
    //#endregion
}
//#endregion


//#region Localization class
// LocalizationClass created from a SceneObject and three arrays of localizationFunctions. For texts, textures and extraInformations.
function LocalizationClass (_parent, _localizedTexts, _localizedTextures, _localizedExtras)
{
    //#region private vars
    this._parent = _parent; // SceneObject, used to collect children and extract datas from them.

    this._currentLangDatas = null; // Current language used.
    this._languageDatas = []; // Access to all languages datas.

    // Access to all localizationFunctions
    this._localizedTexts = _localizedTexts;
    this._localizedTextures = _localizedTextures;
    this._localizedExtras = _localizedExtras;
    //#endregion


    //#region public functions
    // Function used to change the current language. Called at the start.
    this.SetLanguage = function (language)
    {
        var _lang = language ? language : global.localizationSystem.getLanguage();
        this._currentLangDatas = this.FindBestOccurence(_lang);

        for (var i = 0; i < this._localizedTexts.length; ++i)
        {
            var loc = this._localizedTexts[i];
            loc.Localize(this._currentLangDatas.GetText(i));
        }

        for (var i = 0; i < this._localizedTextures.length; ++i)
        {
            var loc = this._localizedTextures[i];
            loc.Localize(this._currentLangDatas.GetTexture(i));
        }

        for (var i = 0; i < this._localizedExtras.length; ++i)
        {
            var loc = this._localizedExtras[i];
            loc.Localize(this._currentLangDatas.GetExtra(i));
        }
    }

    // Function to get all the localization datas.
    this.GetLanguagesDatas = function ()
    {
        var count = this._parent.getChildrenCount();
        for (var i = 0; i < count; ++i)
        {
            var sc = this._parent.getChild(i).getComponent("Component.ScriptComponent");
            if (sc != undefined && sc != null)
            {
                var langData = sc.api.localizationDatas;
                if (langData != undefined && langData != null)
                {
                    this._languageDatas.push(langData);
                }
            }
        }
    }

    // Function to return the best language to use based on the code requested.
    this.FindBestOccurence = function (_lang)
    {
        var langDatas = this._languageDatas[0];

        if (this._languageDatas.length > 1)
        {
            var _langShort = _lang.substring(0, 2);

            for (var i = 0; i < this._languageDatas.length; ++i)
            {
                if (this._languageDatas[i].GetId() === _lang)
                {
                    langDatas = this._languageDatas[i];
                    break;
                }
                else if (this._languageDatas[i].GetId().length < langDatas.GetId().length
                        && this._languageDatas[i].GetId().startsWith(_langShort))
                {
                    langDatas = this._languageDatas[i];
                }
            }
        }

        return langDatas;
    }

    // Function called by the subScenes objects to add themselves to text localization.
    // Gets an ID to match to the correct localization.
    // A SceneObject to check object destruction.
    // A callback to be used when the localization data changes.
    this.LocalizeText = function (_id, _parent, _callback)
    {
        for (var i = 0; i < this._localizedTexts.length; ++i)
        {
            if (this._localizedTexts[i].GetId() === _id)
            {
                this._localizedTexts[i].Add(_parent, _callback);
                return;
            }
        }

        print("Error, couldn't find localization for object : " + _parent.getName() + " with ID : " + _id);
    }


    // Function called by the subScenes objects to add themselves to texture localization.
    // Gets an ID to match to the correct localization.
    // A SceneObject to check object destruction.
    // A callback to be used when the localization data changes.
    this.LocalizeTexture = function (_id, _parent, _callback)
    {
        for (var i = 0; i < this._localizedTextures.length; ++i)
        {
            if (this._localizedTextures[i].GetId() === _id)
            {
                this._localizedTextures[i].Add(_parent, _callback);
                return;
            }
        }

        print("Error, couldn't find localization for object : " + _parent.getName() + " with ID : " + _id);
    }


    // Function called by the subScenes objects to add themselves to extra information localization.
    // Gets an ID to match to the correct localization.
    // A SceneObject to check object destruction.
    // A callback to be used when the localization data changes.
    this.LocalizeExtra = function (_id, _parent, _callback)
    {
        for (var i = 0; i < this._localizedExtras.length; ++i)
        {
            if (this._localizedExtras[i].GetId() === _id)
            {
                this._localizedExtras[i].Add(_parent, _callback);
                return;
            }
        }

        print("Error, couldn't find localization for object : " + _parent.getName() + " with ID : " + _id);
    }
    //#endregion
}
//#endregion