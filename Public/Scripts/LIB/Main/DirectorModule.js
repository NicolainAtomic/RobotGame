// Lib Lens Atomic : Director Module
// Version : 3.2.1
// Dependencies : Update Manager Module
// Authors : Gautier Jacquet

// Doc : https://www.notion.so/atomicdigitaldesign/Director-Module-3f898a08c75e4baea1b8a7006400acfe


function DirectorEvent (_script, _type, _callback)
{
    //#region private vars
    this._script = _script;
    this._type = _type;
    //#endregion

    //#region public vars
    this.event = null;
    this.callback = _callback;
    //#endregion

    //#region public functions
    this.AddEvent = function ()
    {
        if (this.event === null)
        {
            this.event = this._script.createEvent(this._type);
            this.event.bind(this.callback);
        }
    }

    this.RemoveEvent = function ()
    {
        if (this.event !== null)
        {
            this._script.removeEvent(this.event);
            this.event = null;
        }
    }
    //#endregion
}


function DirectorListener (_id, _callback, _setupCallback)
{
    //#region private vars
    this._id = _id;
    //#endregion

    //#region public vars
    this.callback = _callback;
    this.setupCallback = _setupCallback !== undefined ? _setupCallback : function(){};
    //#endregion
    
    //#region public functions
    this.GetId = function () {return this._id;};
    //#endregion
}


function DirectorCaller (_id, _defaultParams)
{
    //#region private vars
    this._id = _id;
    this._dispatcher = null;
    this._params = _defaultParams;
    //#endregion

    //#region public functions
    this.Call = function (params)
    {
        if (this._dispatcher !== null)
        {
            this._dispatcher.Call(params);
        }
        this._params = params;
    }

    this.Setup = function ()
    {
        if (this._dispatcher !== null)
        {
            this._dispatcher.Setup(this._params);
        }
    }

    this.GetId = function () {return this._id;};
    this.GetParams = function () {return this._params;};

    this.SetDispatcher = function (_dispatcher)
    {
        this._dispatcher = _dispatcher;
    }
    //#endregion
}


function SceneCallDispatcher (_caller)
{
    //#region private var
    var _this = this;
    this._callers = [_caller];
    this._id = _caller.GetId();
    this._listeners = [];
    this._params = _caller.GetParams();
    //#endregion

    //#region public functions
    this.GetId = function () {return this._id;};
    this.GetParams = function () {return this._params;};

    this.Call = function (params)
    {
        for (var i = 0; i < this._listeners.length; ++i)
        {
            this._listeners[i].callback(params,this._params);
        }
        
        this._params = params;
    }

    this.Setup = function (params)
    {
        for (var i = 0; i < this._listeners.length; ++i)
        {
            if (this._listeners[i].setupCallback !== null)
            {
                this._listeners[i].setupCallback(params);
            }
        }
    }

    this.AddCaller = function (_caller)
    {
        var i = this._callers.indexOf(_caller);
        if (i === -1)
        {
            this._callers.push(_caller);
            this._params = _caller.GetParams();
            _caller.SetDispatcher(_this);
        }
    }

    this.AddListener = function (_listener, _setup)
    {
        var i = this._listeners.indexOf(_listener);
        if (i === -1)
        {
            this._listeners.push(_listener);
            if (_setup && _listener.setupCallback !== null)
            {
                _listener.setupCallback(this.GetParams());
            }
        }
    }

    this.RemoveCaller = function (_caller)
    {
        var i = this._callers.indexOf(_caller);
        if (i >= 0)
        {
            this._callers.splice(i, 1);
        }
        return this._callers.length;
    }

    this.RemoveListener = function (_listener)
    {
        var i = this._listeners.indexOf(_listener)
        if (i >= 0)
        {
            this._listeners.splice(i, 1);
        }
    }

    this.Destroy = function ()
    {
        for (var i = 0; i < this._callers.length; ++i)
        {
            this._callers[i].SetDispatcher(null);
        }
    }
    //#endregion

    for (var i = 0; i < this._callers.length; ++i)
    {
        this._callers[i].SetDispatcher(_this);
    }
}


global.Director = function (_script, _subSceneParent, _useFrontBack, _onSceneEndFunction)
{
    //#region private vars
    var _this = this;
    this._sceneNames = [];
    this._scenesAll = [];
    this._scenesCommonNames = [];
    this._scenesFrontNames = [];
    this._scenesBackNames = [];
    this._activeScene = null;
    this._script = _script;
    this._sceneObj = this._script.getSceneObject();
    this._useFrontBack = _useFrontBack;
    this._frontParent = null;
    this._backParent = null;
    this._commonParent = null;

    this._subSceneParent = _subSceneParent;
    this._subScenes = [];
 
    this._camBackEvent = this._script.createEvent("CameraBackEvent");
    this._camFrontEvent = this._script.createEvent("CameraFrontEvent");

    this._camBackEvent.bind(function(){_this.OnCamBack();});
    this._camFrontEvent.bind(function(){_this.OnCamFront();});
    //#endregion

    //#region public events
    this.OnSceneEnded = _onSceneEndFunction;
    this.OnCamFront = function (){};
    this.OnCamBack = function (){};
    //#endregion

    //#region private events
    if (this._useFrontBack)
    {
        this.OnCamFront = function(){this.GoToScene(this._scenesFrontNames[0], true, true);};
        this.OnCamBack = function(){this.GoToScene(this._scenesBackNames[0], true, true);};
    }
    //#endregion

    //#region public functions
    this.GetActiveScene = function(){return this._scenesAll[this._activeScene];};

    this.GetScene = function (sceneName)
    {
        return this._scenesAll[sceneName];
    }

    //TODO add delay
    this.GoToScene = function (name, instantShow, instantHide, forceRestart)
    {
        if (instantHide)
        {
            for (var i = 0; i < this._subScenes.length; ++i)
            {
                var sub = this._subScenes[i];
                if (sub.IsVisible() && sub.IsHiding())
                {
                    sub.HideInstant();
                }
            }
        }

        var subScenesOld = undefined;
        var subScenesNew = this._scenesAll[name].GetSubScenes();
        if(this._activeScene !== null)
        {
            subScenesOld = this._scenesAll[this._activeScene].GetSubScenes();
            this._scenesAll[this._activeScene].Stop(instantHide, subScenesNew, forceRestart);
        }
        this._activeScene = name;
        this._scenesAll[this._activeScene].Start(instantShow, subScenesOld, forceRestart);
    }
    //#endregion


    //#region private functions
    this.HideAllInstant = function ()
    {
        for (var i = 0; i < this._sceneNames.length; ++i)
        {
            this._scenesAll[this._sceneNames[i]].Stop(true);
        }

        for (var i = 0; i < this._subScenes.length; ++i)
        {
            if (this._subScenes[i].IsActive())
            {
                print("Warning : La sous scène " + this._subScenes[i].GetName() + " n'est présente dans aucune scène !");
                this._subScenes[i].Stop();
            }
        }
    }


    this.AddScene = function (sceneName, sceneScript, isCommon, isFront)
    {
        this._scenesAll[sceneName] = sceneScript.api.scene;
        this._sceneNames.push(sceneName);
        if (isCommon)
        {
            this._scenesCommonNames.push(sceneName)
        }
        else if (this._useFrontBack && isFront)
        {
            this._scenesFrontNames.push(sceneName)
        }
        else if (this._useFrontBack)
        {
            this._scenesBackNames.push(sceneName)
        }
        sceneScript.api.scene.SetDirector(this);
    }


    this.GetParents = function ()
    {
        var childCount = this._sceneObj.getChildrenCount();
        for (var i = 0; i < childCount; ++i)
        {
            var obj = this._sceneObj.getChild(i);
            if (obj.name.toUpperCase() == "FRONT")
            {
                this._frontParent = obj;
            }
            else if (obj.name.toUpperCase() == "BACK")
            {
                this._backParent = obj;
            }
            else if (obj.name.toUpperCase() == "COMMON")
            {
                this._commonParent = obj;
            }
        }
    }

    this.Setup = function ()
    {
        this.GetParents();
        var childCount = 0;
        if (this._useFrontBack)
        {
            if (this._frontParent !== null)
            {
                childCount = this._frontParent.getChildrenCount();
                for (var i = 0; i < childCount; ++i)
                {
                    var obj = this._frontParent.getChild(i);
                    this.AddScene(obj.name, obj.getComponent("Component.ScriptComponent"), false, true);
                }
            }

            if (this._backParent !== null)
            {
                childCount = this._backParent.getChildrenCount();
                for (var i = 0; i < childCount; ++i)
                {
                    var obj = this._backParent.getChild(i);
                    this.AddScene(obj.name, obj.getComponent("Component.ScriptComponent"), false, false);
                }
            }
        }
        else if (this._commonParent !== null)
        {
            childCount = this._commonParent.getChildrenCount();
            for (var i = 0; i < childCount; ++i)
            {
                var obj = this._commonParent.getChild(i);
                this.AddScene(obj.name, obj.getComponent("Component.ScriptComponent"), true, false);
            }
        }

        this.GetSubScenes(this._subSceneParent);
    }

    this.GetSubScenes = function (parent)
    {
        childCount = parent.getChildrenCount();
        for (var i = 0; i < childCount; ++i)
        {
            var obj = parent.getChild(i);
            var script = obj.getComponent("Component.ScriptComponent");
            if (script !== undefined && script !== null)
            {
                var subScene = script.api.subScene;
                if (subScene !== undefined && subScene !== null)
                {
                    _this._subScenes.push(subScene);
                }
            }
            _this.GetSubScenes(obj);
        }
    }
    //#endregion
    this.Setup();
    this.HideAllInstant();

    if (!this._useFrontBack)
    {
        this.GoToScene(this._scenesCommonNames[0], true);
    }
}


global.Scene = function (_script, _subScenesScript)
{
    //#region private vars
    var _this = this;
    this._director = null;
    this._script = _script;
    this._name = this._script.getSceneObject().name;
    this._subScenes = [];
    this._active = true;
    this._initialized = false;
    this._update = new global.Update(_script.getSceneObject(), UpdateType.Update, function(){_this._Update()});;
    this._lateUpdate = new global.Update(_script.getSceneObject(), UpdateType.LateUpdate, function(){_this._LateUpdate()});
    this._events = [];
    this._callers = [];
    this._listeners = [];
    this._activationCount = 0;
    this._sceneDispatchers = [];
    //#endregion
    
    //#region public events
    this.OnStart = function(){};
    this.OnLateStart = function(){};
    this.OnStop = function(){};
    this.OnLateStop = function(){};
    //#endregion

    //#region private events
    this._Update = null;
    this._LateUpdate = null;
    //#endregion

    //#region public functions
    this.IsActive = function(){return this._active;};
    this.IsInitialized = function(){return this._initialized;};
    this.GetName = function(){return this._name;};
    this.GetSubScenes = function(){return this._subScenes;};
    this.SetDirector = function(director){this._director = director;};
    this.GetDirector = function(){return this._director};
    this.GetActivationCount = function(){return this._activationCount;};

    this.Start = function (showInstant, oldScenes, forceRestart)
    {
        this._initialized = true;
        this._active = true;
        this._activationCount++;
        this.OnStart();
        this.SetCallers();

        for (var i = 0; i < this._subScenes.length; ++i)
        {
            this._subScenes[i].SetSceneScript(this._script);
            if (forceRestart || oldScenes === undefined || oldScenes.indexOf(this._subScenes[i]) === -1)
            {
                this._subScenes[i].Start(showInstant);
            }
            this._subScenes[i].SetCallers();
        }

        
        this.SetListeners();

        for (var i = 0; i < this._subScenes.length; ++i)
        {
            var setup = forceRestart || oldScenes === undefined || oldScenes.indexOf(this._subScenes[i]) === -1;
            this._subScenes[i].SetListeners(setup);
        }

        if (this._Update && !this._update.IsAdded())
        {
            this._update.Add();
        }
        if (this._LateUpdate && !this._lateUpdate.IsAdded())
        {
            this._lateUpdate.Add();
        }

        for (var i = 0; i < this._events.length; ++i)
        {
            this._events[i].AddEvent();
        }

        this.OnLateStart();

        for (var i = 0; i < this._subScenes.length; ++i)
        {
            if (forceRestart || oldScenes === undefined || oldScenes.indexOf(this._subScenes[i]) === -1)
            {
                this._subScenes[i].LateStart();
            }
            this._subScenes[i].ChangeScene();
        }
    }

    this.Stop = function (hideInstant, newScenes, forceRestart)
    {
        if (this._initialized)
        {
            if (this._Update && this._update.IsAdded())
            {
                this._update.Remove();
            }
            if (this._LateUpdate && this._lateUpdate.IsAdded())
            {
                this._lateUpdate.Remove();
            }

            for (var i = 0; i < this._events.length; ++i)
            {
                this._events[i].RemoveEvent();
            }
        }

        for (var i = 0; i < this._sceneDispatchers.length; ++i)
        {
            this._sceneDispatchers[i].Destroy();
        }
        this._sceneDispatchers = [];

        this._active = false;
        this.OnStop();
        
        for (var i = 0; i < this._subScenes.length; ++i)
        {
            if (forceRestart || newScenes === undefined || newScenes.indexOf(this._subScenes[i]) === -1)
            {
                this._subScenes[i].Stop(hideInstant);
            }
        }

        this.OnLateStop();
    }

    this.SceneEnded = function (params)
    {
        this._director.OnSceneEnded(this._name, params);
    }

    this.SetUpdate = function (_function)
    {
        this._Update = _function;
        if (_function && this._active && this._initialized && !this._update.IsAdded())
        {
            this._update.Add();
        }
        else if (!_function && this._update.IsAdded())
        {
            this._update.Remove();
        }
    }

    this.SetLateUpdate = function (_function)
    {
        this._LateUpdate = _function;
        if (_function && this._active && this._initialized && !this._lateUpdate.IsAdded())
        {
            this._lateUpdate.Add();
        }
        else if (!_function && this._lateUpdate.IsAdded())
        {
            this._lateUpdate.Remove();
        }
    }

    this.ChangeUpdateOrder = function (_order)
    {
        this._update.ChangeOrder(_order);
    }

    this.ChangeLateUpdateOrder = function (_order)
    {
        this._lateUpdate.ChangeOrder(_order);
    }

    this.SetEnableUpdate = function (_enabled)
    {
        this._update.enabled = _enabled;
    }

    this.SetEnableLateUpdate = function (_enabled)
    {
        this._lateUpdate.enabled = _enabled;
    }

    this.CreateEvent = function (_type, _callback)
    {
        var event = new DirectorEvent(_this._script, _type, _callback);

        if (_this._active && _this._initialized)
        {
            event.AddEvent();
        }

        _this._events.push(event);

        return event;
    }

    this.DeleteEvent = function (_event)
    {
        if (_this._active && _this._initialized)
        {
            _event.RemoveEvent();
        }

        var i = _this._events.indexOf(_event);
        if (i >= 0)
        {
            _this._events.splice(i, 1);
        }
    }

    this.AddCallerToDispatcher = function (_caller)
    {
        var dispatcher = null;
        for (var i = 0; i < this._sceneDispatchers.length; ++i)
        {
            if (this._sceneDispatchers[i].GetId() === _caller.GetId())
            {
                dispatcher = this._sceneDispatchers[i];
                break;
            }
        }

        if (dispatcher === null)
        {
            dispatcher = new SceneCallDispatcher(_caller);
            _this._sceneDispatchers.push(dispatcher);
        }
        else
        {
            dispatcher.AddCaller(_caller);
        }
    }

    this.RemoveCallerFromDispatcher = function (_caller)
    {
        var id = -1;
        for (var i = 0; i < this._sceneDispatchers.length; ++i)
        {
            if (this._sceneDispatchers[i].GetId() === _caller.GetId())
            {
                id = i;
                break;
            }
        }
        
        if (id >= 0)
        {
            if (_this._sceneDispatchers[i].RemoveCaller(_caller) <= 0) // Retourne la taille du tableau des callers restant, on supprime le dispatcher si la liste est vide.
            {
                _this._sceneDispatchers.splice(i, 1);
            }
        }
        else
        {
            print("Warning : Le dispatcher pour le caller " + _caller.GetId() + " n'existe pas, il ne peut donc pas être supprimé !");
        }
    }

    this.AddDirectorListener = function (_listener, _setup)
    {
        var id = -1;
        for (var i = 0; i < this._sceneDispatchers.length; ++i)
        {
            if (this._sceneDispatchers[i].GetId() === _listener.GetId())
            {
                id = i;
                break;
            }
        }
        
        if (id >= 0)
        {
            this._sceneDispatchers[id].AddListener(_listener, _setup);
        }
        else if (_listener.GetId() !== "SceneEnded")
        {
            print("Warning : Un listener pour " + _listener.GetId() + " doit être ajouté mais aucun caller n'a cet ID !");
        }
    }

    this.RemoveDirectorListener = function (_listener)
    {
        var id = -1;
        for (var i = 0; i < this._sceneDispatchers.length; ++i)
        {
            if (this._sceneDispatchers[i].GetId() === _listener.GetId())
            {
                id = i;
                break;
            }
        }
        
        if (id >= 0)
        {
            this._sceneDispatchers[id].RemoveListener(_listener);
        }
        else
        {
            print("Warning : Un listener pour " + _listener.GetId() + " doit être supprimé mais n'existe pas dans la liste !");
        }
    }

    this.CreateCaller = function (_id, _defaultParams)
    {
        var caller = new DirectorCaller (_id, _defaultParams);
        this._callers.push(caller);

        if (this._active && this._initialized)
        {
            this.AddCallerToDispatcher(caller);
        }

        return caller;
    }

    this.DeleteCaller = function (_caller)
    {
        if (this._active && this._initialized)
        {
            this.RemoveCallerFromDispatcher(_caller);
        }

        var i = _this._callers.indexOf(_caller);
        if (i >= 0)
        {
            _this._callers.splice(i, 1);
        }
    }

    this.CreateListener = function (_id, _callback, _setupCallback)
    {
        var listener = new DirectorListener (_id, _callback, _setupCallback);
        this._listeners.push(listener);

        if (this._active && this._initialized)
        {
            this.AddDirectorListener(listener, true);
        }

        return listener;
    }

    this.DeleteListener = function (_listener)
    {
        if (this._active && this._initialized)
        {
            this.RemoveListener(_listener);
        }

        var i = this._listeners.indexOf(_listener);
        if (i >= 0)
        {
            this._listeners.splice(i, 1);
        }
    }

    this.SetCallers = function ()
    {
        for (var i = 0; i < this._callers.length; ++i)
        {
            this.AddCallerToDispatcher(this._callers[i]);
        }
    }

    this.SetListeners = function (_setup)
    {
        for (var i = 0; i < this._listeners.length; ++i)
        {
            this.AddDirectorListener(this._listeners[i], _setup);
        }
    }
    //#endregion

    //#region private functions
    this.Setup = function ()
    {
        for (var i = 0; i < _subScenesScript.length; ++i)
        {
            this._subScenes.push(_subScenesScript[i].api.subScene);
        }
    }
    //#endregion

    this.Setup();
}


global.SubScene = function (_script, _parent, _show, _hide, _showInstant, _hideInstant)
{
    //#region private vars
    var _this = this;
    this._script = _script;
    this._sceneScript = null;
    this._name = this._script.getSceneObject().name;
    this._parent = _parent;
    this._active = true;
    this._initialized = false;
    this._hiding = false;
    this._update = new global.Update(_script.getSceneObject(), UpdateType.Update, function(){_this._Update()});
    this._lateUpdate = new global.Update(_script.getSceneObject(), UpdateType.LateUpdate, function(){_this._LateUpdate()});
    this._events = [];
    this._callers = [];
    this._listeners = [];
    this._activationCount = 0;
    //#endregion

    //#region public events
    this.Show = _show !== undefined ? _show :
                            function(){this._parent.enabled = true;};
    this.Hide = _hide !== undefined ? _hide :
                            function(){this._parent.enabled = false;};
    this.ShowInstant = _showInstant !== undefined ? _showInstant :
                            function(){this._parent.enabled = true;};
    this.HideInstant = _hideInstant !== undefined ? _hideInstant :
                            function(){this._parent.enabled = false;};

    this.OnStart = function(){};
    this.OnLateStart = function(){};
    this.OnSceneChanged = function(){};
    this.OnStop = function(){};
    //#endregion

    //#region private events
    this._Update = null;
    this._LateUpdate = null;
    //#endregion

    //#region public functions
    this.IsActive = function(){return this._active;};
    this.IsInitialized = function(){return this._initialized;};
    this.IsVisible = function(){return this._parent.enabled;};
    this.IsHiding = function(){return this._hiding;};
    this.GetActivationCount = function(){return this._activationCount;};
    this.GetName = function(){return this._name;};
    this.GetParent = function(){return this._parent;};
    this.GetSceneScript = function(){return this._sceneScript;};
    this.SetSceneScript = function(sceneScript){this._sceneScript = sceneScript;};

    this.CallEnd = function (_params)
    {
        this.GetSceneScript().api.scene.SceneEnded(_params);
    }

    this.ChangeScene = function ()
    {
        this.OnSceneChanged();
    }

    this.Start = function (showInstant)
    {
        this._initialized = true;
        this._activationCount++;
        if (!this._active)
        {
            this._hiding = false;
            if (this.OnStart !== null && this.OnStart !== undefined)
            {
                this.OnStart();
            }
            if (showInstant)
            {
                if (this.ShowInstant !== null && this.ShowInstant !== undefined)
                {
                    this.ShowInstant();
                }
                else
                {
                    print("WARNING : ShowInstant for subscene " + this.GetName() + " was called but is undefined or null");
                    this._parent.enabled = true;
                }
            }
            else
            {
                if (this.Show !== null && this.Show !== undefined)
                {
                    this.Show();
                }
                else
                {
                    print("WARNING : Show for subscene " + this.GetName() + " was called but is undefined or null");
                    this._parent.enabled = true;
                }
            }

            if (this._Update && !this._update.IsAdded())
            {
                this._update.Add();
            }
            if (this._LateUpdate && !this._lateUpdate.IsAdded())
            {
                this._lateUpdate.Add();
            }

            for (var i = 0; i < this._events.length; ++i)
            {
                this._events[i].AddEvent();
            }
        }
    }

    this.LateStart = function()
    {
        if (this.OnLateStart !== null && this.OnLateStart !== undefined)
        {
            this.OnLateStart();
        }

        this._active = true;
    }

    this.Stop = function (hideInstant)
    {
        if (this._active)
        {
            if (this._initialized)
            {
                if (this._update.IsAdded())
                {
                    this._update.Remove();
                }
                if (this._lateUpdate.IsAdded())
                {
                    this._lateUpdate.Remove();
                }

                for (var i = 0; i < this._events.length; ++i)
                {
                    this._events[i].RemoveEvent();
                }
            }

            this._hiding = true;
            if (this.OnStop !== null && this.OnStop !== undefined)
            {
                this.OnStop();
            }
            if (hideInstant)
            {
                if (this.HideInstant !== null && this.HideInstant !== undefined)
                {
                    this.HideInstant();
                }
                else
                {
                    print("WARNING : HideInstant for subscene " + this.GetName() + " was called but is undefined or null");
                    this._parent.enabled = false;
                }
            }
            else
            {
                if (this.Hide !== null && this.Hide !== undefined)
                {
                    this.Hide();
                }
                else
                {
                    print("WARNING : Hide for subscene " + this.GetName() + " was called but is undefined or null");
                    this._parent.enabled = false;
                }
            }
            this._active = false;
        }
    }

    this.SetUpdate = function (_function)
    {
        this._Update = _function;
        if (_function && this._active && this._initialized && !this._update.IsAdded())
        {
            this._update.Add();
        }
        else if (!_function && this._update.IsAdded())
        {
            this._update.Remove();
        }
    }

    this.SetLateUpdate = function (_function)
    {
        this._LateUpdate = _function;
        if (_function && this._active && this._initialized && !this._lateUpdate.IsAdded())
        {
            this._lateUpdate.Add();
        }
        else if (!_function && this._lateUpdate.IsAdded())
        {
            this._lateUpdate.Remove();
        }
    }

    this.ChangeUpdateOrder = function (_order)
    {
        this._update.ChangeOrder(_order);
    }

    this.ChangeLateUpdateOrder = function (_order)
    {
        this._lateUpdate.ChangeOrder(_order);
    }

    this.SetEnableUpdate = function (_enabled)
    {
        this._update.enabled = _enabled;
    }

    this.SetEnableLateUpdate = function (_enabled)
    {
        this._lateUpdate.enabled = _enabled;
    }

    this.CreateEvent = function (_type, _callback)
    {
        var event = new DirectorEvent(_this._script, _type, _callback);

        if (this._active && this._initialized)
        {
            event.AddEvent();
        }

        _this._events.push(event);

        return event;
    }

    this.DeleteEvent = function (_event)
    {
        if (_this._active && _this._initialized)
        {
            _event.RemoveEvent();
        }

        var i = _this._events.indexOf(_event);
        if (i >= 0)
        {
            _this._events.splice(i, 1);
        }
    }

    this.CreateCaller = function (_id, _defaultParams)
    {
        var caller = new DirectorCaller (_id, _defaultParams);
        this._callers.push(caller);

        if (this._active && this._initialized)
        {
            this._sceneScript.api.scene.AddCallerToDispatcher(caller);
        }

        return caller;
    }

    this.DeleteCaller = function (_caller)
    {
        if (this._active && this._initialized)
        {
            this._sceneScript.api.scene.RemoveCallerFromDispatcher(_caller);
        }

        var i = _this._callers.indexOf(_caller);
        if (i >= 0)
        {
            _this._callers.splice(i, 1);
        }
    }

    this.CreateListener = function (_id, _callback, _setupCallback)
    {
        var listener = new DirectorListener (_id, _callback, _setupCallback);
        this._listeners.push(listener);

        if (this._active && this._initialized)
        {
            this._sceneScript.api.scene.AddDirectorListener(listener, true);
        }

        return listener;
    }

    this.DeleteListener = function (_listener)
    {
        if (this._active && this._initialized)
        {
            this._sceneScript.api.scene.RemoveListener(_listener);
        }

        var i = this._listeners.indexOf(_listener);
        if (i >= 0)
        {
            this._listeners.splice(i, 1);
        }
    }

    this.SetCallers = function ()
    {
        for (var i = 0; i < this._callers.length; ++i)
        {
            this._sceneScript.api.scene.AddCallerToDispatcher(this._callers[i]);
        }
    }

    this.SetListeners = function (_setup)
    {
        for (var i = 0; i < this._listeners.length; ++i)
        {
            this._sceneScript.api.scene.AddDirectorListener(this._listeners[i], _setup);
        }
    }
    //#endregion
}