// Lib Lens Atomic : PoolManager Module
// Version : 0.1
// Authors : Guillaume Bertrand

// Doc : https://www.notion.so/atomicdigitaldesign/PoolManager-0c45124afb0f4b0fb6e8b4cfb1fe8d8f

//To use as an input : "@"
//input int fullBehavior {"widget":"combobox","values":[{"label":"Error","value":0},{"label":"Repick","value":1},{"label":"Increase","value":2}]}
//input int prefabType {"widget":"combobox","values":[{"label":"Order","value":0},{"label":"Random","value":1}]}

//TODO: add prefab array for poolmanager

// Enum to set the full behavior rules
global.FullBehavior = {Error : 0, Repick : 1, Increase : 2}

// Enum to set the prefab type rules
global.PrefabType = {Order : 0, Random : 1}

global.PoolManager = function(prefabObject, maxInstances, instantiateOnStart, parent, prefabType, fullBehavior)
{
    
    //#region private vars
    this._prefabObject = prefabObject;
    this._prefabType = prefabType != undefined ? prefabType : PrefabType.Loop;
    this._maxInstances = maxInstances;
    this._instantiateOnStart = instantiateOnStart;
    this._fullBehavior = fullBehavior != undefined ? fullBehavior : FullBehavior.Error;
    this._parent = parent != undefined ? parent : null;
    this._actualInstanceNumber = 0;        
    this._availableObjects = [];
    this._usedObjects = [];
    this._idPrefabType = 0;
    //#endregion
    
    //#region public functions
    this.PickElement = function()
    {
        if (this._availableObjects.length > 0)
        {
            return this._PickLastAvailable();
        }
        else
        {
            if (this._actualInstanceNumber < this._maxInstances)
            {
                this._CreateElement();
                return this._PickLastAvailable();
            }
            else
            {
                switch(this._fullBehavior)
                {
                    case FullBehavior.Error:
                        print("Error : No more objects available");
                        return null;
                    break;
                    case FullBehavior.Repick:
                        this._usedObjects.push(this._usedObjects.shift());
                        return this._usedObjects[this._usedObjects.length-1];
                    break;
                    case FullBehavior.Increase:
                        this._CreateElement();
                        return this._PickLastAvailable();
                    break;
                }
            }
        }
    }
    
    this.DeleteElement = function(element)
    {
        indexElement = this._usedObjects.indexOf(element); 
        if (indexElement == -1)        
        {
            print("Error : Element not used");
            return;
        }
        this._usedObjects.splice(indexElement, 1);
        this._availableObjects.push(element);
        element.enabled = false;
    }
    //#endregion
    
    //#region private functions
    this._CreateElement = function()
    {
        this._availableObjects.push(this._prefabObject[this._idPrefabType].instantiate(parent));
        if (this._prefabType == PrefabType.Order)
        {
            this._idPrefabType = this._idPrefabType + 1 < this._prefabObject.length ? this._idPrefabType + 1 : 0;            
        }else
        {
            this._idPrefabType = Math.floor(Math.random()*this._prefabObject.length);
        }
        this._availableObjects[this._availableObjects.length-1].enabled = false;
        this._actualInstanceNumber++;
    }
    
    this._PickLastAvailable = function()
    {
        this._usedObjects.push(this._availableObjects.pop());
        this._usedObjects[this._usedObjects.length-1].enabled = true;
        return this._usedObjects[this._usedObjects.length-1];
    }
    
    this._Initialise = function()
    {           
        if (this._instantiateOnStart)
        {
            for (var instanceNumber = 0; instanceNumber < maxInstances; instanceNumber++)
            {
                this._CreateElement();
            }
        }
    }
    this._Initialise();
    //#endregion
}