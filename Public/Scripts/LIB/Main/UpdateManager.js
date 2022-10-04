// Lib Lens Atomic : Update Manager Module
// Version : 1.0.0
// Dependencies : None
// Authors : Gautier Jacquet

// Doc : https://www.notion.so/atomicdigitaldesign/Update-Manager-8b3509ed00604b09a775c8d073222f1e


var UpdateManager = new UpdateManagerClass();


global.UpdateType = {PreUpdate : 0, Update : 10, InterUpdate : 20, LateUpdate : 30, PostUpdate : 40}


global.Update = function (_obj, _type, _callback, _enabled, _order)
{
    //#region public vars
    this.callback = _callback;
    this.enabled = _enabled !== undefined ? _enabled : true;
    this.obj = _obj;
    //#endregion


    //#region private vars
    var _this = this;
    this._added = false;
    this._order = _order !== undefined ? _order : 0;
    this._type = _type;
    //#endregion

    
    //#region public functions
    this.IsAdded = function(){return this._added;};
    this.GetOrder = function(){return this._order};

    this.Add = function ()
    {
        if (!this._added)
        {
            var added = true;
            switch (this._type)
            {
                case UpdateType.PreUpdate:
                    UpdateManager.AddPreUpdate(_this);
                    break;
                case UpdateType.Update:
                    UpdateManager.AddUpdate(_this);
                    break;
                case UpdateType.InterUpdate:
                    UpdateManager.AddInterUpdate(_this);
                    break;
                case UpdateType.LateUpdate:
                    UpdateManager.AddLateUpdate(_this);
                    break;
                case UpdateType.PostUpdate:
                    UpdateManager.AddPostUpdate(_this);
                    break;
                default:
                    print("Warning : update wasn't added -> no valid type ! obj object is : " + this.obj.name);
                    added = false;
            }
            this._added = added;
        }
        else
        {
            print("Warning : update wasn't added -> already added ! obj object is : " + this.obj.name);
        }
    }

    this.ChangeOrder = function (_order)
    {
        this._order = _order;

        if (this._added)
        {
            switch (this._type)
            {
                case UpdateType.PreUpdate:
                    UpdateManager.ReorderPreUpdates();
                    break;
                case UpdateType.Update:
                    UpdateManager.ReorderUpdates();
                    break;
                case UpdateType.InterUpdate:
                    UpdateManager.ReorderInterUpdates();
                    break;
                case UpdateType.LateUpdate:
                    UpdateManager.ReorderLateUpdates();
                    break;
                case UpdateType.PostUpdate:
                    UpdateManager.ReorderPostUpdates();
                    break;
                default:
            }
        }
    }

    this.ChangeType = function (_type)
    {
        if (this._added)
        {
            this.Remove();
            this._type = _type;
            this.Add();
        }
        else
        {
            this._type = _type;
        }
    }

    this.Remove = function ()
    {
        if (this._added)
        {
            switch (this._type)
            {
                case UpdateType.PreUpdate:
                    UpdateManager.RemovePreUpdate(_this);
                    break;
                case UpdateType.Update:
                    UpdateManager.RemoveUpdate(_this);
                    break;
                case UpdateType.InterUpdate:
                    UpdateManager.RemoveInterUpdate(_this);
                    break;
                case UpdateType.LateUpdate:
                    UpdateManager.RemoveLateUpdate(_this);
                    break;
                case UpdateType.PostUpdate:
                    UpdateManager.RemovePostUpdate(_this);
                    break;
                default:
                    print("Warning : update wasn't removed -> no valid type ! object is : " + this.obj.name);
            }
            this._added = false;
        }
        else
        {
            print("Warning : update wasn't added -> not currently added ! object is : " + this.obj.name);
        }
    }
    //#endregion
}



function UpdateManagerClass ()
{
    //#region private vars
    var _this = this;

    this._preUpdates = [];
    this._updates = [];
    this._interUpdates = [];
    this._lateUpdates = [];
    this._postUpdates = []; 

    this._preUpdatesReorder = false;
    this._updatesReorder = false;
    this._interUpdatesReorder = false;
    this._lateUpdatesReorder = false;
    this._postUpdatesReorder = false;

    this._updateEvent = script.createEvent("UpdateEvent");
    this._lateUpdateEvent = script.createEvent("LateUpdateEvent");
    //#endregion


    //#region public functions
    this.AddPreUpdate = function (_update)
    {
        this._InternalAddUpdate(_this._preUpdates, _update);
    }

    this.AddUpdate = function (_update)
    {
        this._InternalAddUpdate(_this._updates, _update);
    }

    this.AddInterUpdate = function (_update)
    {
        this._InternalAddUpdate(_this._interUpdates, _update);
    }

    this.AddLateUpdate = function (_update)
    {
        this._InternalAddUpdate(_this._lateUpdates, _update);
    }

    this.AddPostUpdate = function (_update)
    {
        this._InternalAddUpdate(_this._postUpdates, _update);
    }


    this.RemovePreUpdate = function (_update)
    {
        this._InternalRemoveUpdate(_this._preUpdates, _update);
    }

    this.RemoveUpdate = function (_update)
    {
        this._InternalRemoveUpdate(_this._updates, _update);
    }

    this.RemoveInterUpdate = function (_update)
    {
        this._InternalRemoveUpdate(_this._interUpdates, _update);
    }

    this.RemoveLateUpdate = function (_update)
    {
        this._InternalRemoveUpdate(_this._lateUpdates, _update);
    }

    this.RemovePostUpdate = function (_update)
    {
        this._InternalRemoveUpdate(_this._postUpdates, _update);
    }


    this.ReorderPreUpdates = function ()
    {
        this._preUpdatesReorder = true;
    }

    this.ReorderUpdates = function ()
    {
        this._updatesReorder = true;
    }

    this.ReorderInterUpdates = function ()
    {
        this._interUpdatesReorder = true;
    }

    this.ReorderLateUpdates = function ()
    {
        this._lateUpdatesReorder = true;
    }

    this.ReorderPostUpdates = function ()
    {
        this._postUpdatesReorder = true;
    }
    //#endregion


    //#region private functions
    this._SortUpdate = function (a, b)
    {
        return a.GetOrder() - b.GetOrder();
    }


    this._InternalAddUpdate = function (_array, _update)
    {
        if (_array.length == 0)
        {
            _array.push(_update);
        }
        else
        {
            for (var i = _array.length - 1; i >= 0; i--)
            {
                if (_array[i] && _array[i].GetOrder() <= _update.GetOrder())
                {
                    _array.splice(i+1, 0, _update);
                    break;
                }
                else if (i == 0)
                {
                    _array.splice(i, 0, _update);
                }
            }
        }
    }


    this._InternalRemoveUpdate = function (_array, _update)
    {
        if (_array.length == 0)
        {
            print("Warning : tried to remove an update but the array is empty !");
        }
        else
        {
            var i = _array.indexOf(_update);
            if (i >= 0)
            {
                _array[i] = null;
            }
            else
            {
                print("Warning : tried to remove an update but it is not in the array !");
            }
        }
    }


    this._InternalUpdate = function ()
    {
        if (_this._preUpdatesReorder)
        {
            _this._preUpdates.sort(_this._SortUpdate);
            _this._preUpdatesReorder = false;
        }
        for (var i = 0; i < _this._preUpdates.length; ++i)
        {
            var update = _this._preUpdates[i];
            if (update && !isNull(update.obj))
            {
                if (update.enabled)
                {
                    update.callback();
                }
            }
            else
            {
                _this._preUpdates.splice(i, 1);
                i--;
            }
        }

        if (_this._updatesReorder)
        {
            _this._updates.sort(_this._SortUpdate);
            _this._updatesReorder = false;
        }
        for (var i = 0; i < _this._updates.length; ++i)
        {
            var update = _this._updates[i];
            if (update && !isNull(update.obj))
            {
                if (update.enabled)
                {
                    update.callback();
                }
            }
            else
            {
                _this._updates.splice(i, 1);
                i--;
            }
        }

        if (_this._interUpdatesReorder)
        {
            _this._interUpdates.sort(_this._SortUpdate);
            _this._interUpdatesReorder = false;
        }
        for (var i = 0; i < _this._interUpdates.length; ++i)
        {
            var update = _this._interUpdates[i];
            if (update && !isNull(update.obj))
            {
                if (update.enabled)
                {
                    update.callback();
                }
            }
            else
            {
                _this._interUpdates.splice(i, 1);
                i--;
            }
        }
    }


    this._InternalLateUpdate = function ()
    {
        if (_this._lateUpdatesReorder)
        {
            _this._lateUpdates.sort(_this._SortUpdate);
            _this._lateUpdatesReorder = false;
        }
        for (var i = 0; i < _this._lateUpdates.length; ++i)
        {
            var update = _this._lateUpdates[i];
            if (update && !isNull(update.obj))
            {
                if (update.enabled)
                {
                    update.callback();
                }
            }
            else
            {
                _this._lateUpdates.splice(i, 1);
                i--;
            }
        }

        if (_this._postUpdatesReorder)
        {
            _this._postUpdates.sort(_this._SortUpdate);
            _this._postUpdatesReorder = false;
        }
        for (var i = 0; i < _this._postUpdates.length; ++i)
        {
            var update = _this._postUpdates[i];
            if (update && !isNull(update.obj))
            {
                if (update.enabled)
                {
                    update.callback();
                }
            }
            else
            {
                _this._postUpdates.splice(i, 1);
                i--;
            }
        }
    }
    //#endregion

    //#region setup
    this._updateEvent.bind(_this._InternalUpdate);
    this._lateUpdateEvent.bind(_this._InternalLateUpdate);
    //#endregion
}