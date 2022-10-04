// Lib Lens Atomic : Animation Module
// Version : 2.1.2
// Dependencies : Update Manager Module
// Authors : Gautier Jacquet, Guillaume Bertrand

// Doc : https://www.notion.so/atomicdigitaldesign/Animation-Module-2f30ec117cae45e192fe1367effac6ee


// Enum to set the repeat rules
global.RepeatMode = {None : 0, Loop : 1, PingPong : 2}

// Enum to set the timecode mode
global.TimeCodeMode = {Ratio : 0, FixedTime : 1}

// Function TimecodeEvent, defined by a timeCode, the callback method
global.TimeCodeEvent = function(_timeCode, _callback)
{
    //#region public vars
    this.timeCode = _timeCode;
    //#endregion
    
    //#region private vars
    this.callback = _callback;    
    //#endregion
    
}

// Function Animation, defined by a duration, an update method and a repeatMode
global.Animation = function (_obj, _duration, _update, _repeatMode, _updateType, _order)
{
    //#region public vars
    this.duration = _duration;
    this.durationDown = _duration;
    this.repeatMode = _repeatMode !== undefined ? _repeatMode : RepeatMode.None;
    //#endregion


    //#region private vars
    var _this = this;
    this._ratio = 0;
    this._clampedRatio = 0;
    this._targetRatio = 1;
    this._goingUp = true;
    this._repeatCount = 0;
    this._paused = false;
    this._arrayTimeCodeEvent = [];
    this._indexTimeCode;
    this._updateType = _updateType !== undefined ? _updateType : UpdateType.InterUpdate;
    this._order = _order !== undefined ? _order : 100;
    
    this._updateEvent = new global.Update(_obj, this._updateType, function(){_this._InternalUpdate();}, false, this._order);
    this._updateEvent.Add();
    //#endregion


    //#region public events
    this.Update = _update;
    this.Easing = function(r){return r;};

    this.OnEnd = function(r){};
    this.OnStart = function(r){};
    this.OnLoop = function(r){};
    //#endregion


    //#region public functions
    this.IsPlaying = function(){return this._updateEvent.enabled;};
    this.IsPaused = function(){return this._paused;};
    this.IsGoingUp = function(){return this._goingUp;};
    this.GetRatio = function(){return this._clampedRatio;};
    this.GetRepeatCount = function(){return this._repeatCount;};

    this.Start = function (repeats, offset)
    {
        repeats = repeats !== undefined ? repeats : 0;
        offset = offset !== undefined ? offset : 0;

        this._ratio = offset;
        this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1);
        this._targetRatio = 1;
        this._repeatCount = repeats;
        this._goingUp = true;
        this._updateEvent.enabled = true;
        this._paused = false;
        this._ResetIndexTimeCode();
        this.OnStart(this._clampedRatio);
    }

    this.Reset = function ()
    {
        this._ratio = 0;
        this._clampedRatio = 0;
        this._indexTimeCode = 0;
        this._targetRatio = 1;
        this._repeatCount = 0;
        this._goingUp = true;
        this.Update(this.Easing(this._clampedRatio));
        this._updateEvent.enabled = false;
        this._paused = false;
    }

    this.Pause = function ()
    {
        this._paused = true;
        this._updateEvent.enabled = false;
    }

    this.Resume = function ()
    {
        if (this._paused)
        {
            this._paused = false;
            this._updateEvent.enabled = true;
        }
        else
        {
            print("Animation : Resume called but the animation wasn't paused first !");
        }
    }

    this.GoTo = function (target)
    {
        this._repeatCount = 0;
        this._targetRatio = Math.min(Math.max(target, 0), 1);
        this._goingUp = this._ratio <= this._targetRatio;
        this._ResetIndexTimeCode();

        if (!this._updateEvent.enabled)
        {
            this.OnStart(this._ratio);
            this._updateEvent.enabled = true;
        }
    }

    this.JumpTo = function (target)
    {
        this._ratio = Math.min(Math.max(target, 0), 1);
        this._clampedRatio = this._ratio;
        this._ResetIndexTimeCode();
        
        this.Update(this.Easing(this._clampedRatio));
        this._updateEvent.enabled = false;
    }
            
    this.AddTimeCodeEvent = function (_timeCode, _callback, _timeCodeType)
    {
        if(_timeCodeType === TimeCodeMode.FixedTime)
        {
            _timeCode = _timeCode/this.duration;
        }

        var ind = -1;
        for (var i = 0; i < this._arrayTimeCodeEvent.length; ++i)
        {
            if (this._arrayTimeCodeEvent[i].timeCode > _timeCode)
            {
                ind = i;
                break;
            }
        }
        if (ind === -1)
        {
            this._arrayTimeCodeEvent.push(
                new TimeCodeEvent(_timeCode, _callback));
        }
        else
        {
            this._arrayTimeCodeEvent.splice(ind, 0, new TimeCodeEvent(_timeCode, _callback));
        }
        if (this._clampedRatio > _timeCode && this._goingUp)
        {
           this._indexTimeCode = Math.min(this._arrayTimeCodeEvent.length,
                this._indexTimeCode + 1);
        }
        else if (this.clampedRatio < _timeCode && !this._goingUp)
        {
           this._indexTimeCode = Math.max(this._indexTimeCode - 1, -1);         
        }
    }
    
    this.ChangeUpdateType = function (_type)
    {
        this._updateEvent.ChangeType(_type);
    }

    this.ChangeUpdateOrder = function (_order)
    {
        this._updateEvent.ChangeUpdateOrder(_order);
    }
    //#endregion


    //#region private functions
    this._InternalUpdate = function ()
    {
        var ended = false;
        var looped = false;
        if (this._goingUp)
        {
            this._ratio += getDeltaTime() / this.duration;
            this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1);
            while (this._indexTimeCode < this._arrayTimeCodeEvent.length && 
                this._clampedRatio >= this._arrayTimeCodeEvent[this._indexTimeCode].timeCode)
            {
                this._arrayTimeCodeEvent[this._indexTimeCode].callback();
                this._indexTimeCode = this._indexTimeCode + 1;
            }
        }
        else
        {
            this._ratio -= getDeltaTime() / this.durationDown;
            this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1); 
            while (this._indexTimeCode > -1 && 
                this._clampedRatio <= this._arrayTimeCodeEvent[this._indexTimeCode].timeCode)
            {
                this._arrayTimeCodeEvent[this._indexTimeCode].callback();
                this._indexTimeCode = this._indexTimeCode - 1;
            }
        }

        do
        {
            if (this._goingUp)
            {
                if (this._ratio >= this._targetRatio)
                {
                    if (this.repeatMode === RepeatMode.None || this._repeatCount === 0 || this._targetRatio < 1)
                    {
                        this._ratio = this._targetRatio;
                        this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1); 
                        this._updateEvent.enabled = false;
                        ended = true;
                    }
                    else
                    {
                        if (this.repeatMode === RepeatMode.Loop)
                        {
                            this._ratio = this._ratio - 1;
                            this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1);
                            this._indexTimeCode = 0;
                        }
                        else if (this.repeatMode === RepeatMode.PingPong)
                        {
                            this._goingUp = false;
                            this._ratio = 2 - this._ratio; // for 1 - (ratio - 1), 1 being the anim end, (ratio - 1) being the overstep
                            this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1);
                            this._targetRatio = 0;
                            this._indexTimeCode = this._arrayTimeCodeEvent.length-1;
                        }
                        
                        if (this._repeatCount > 0)
                        {
                            this._repeatCount--;
                        }
                        
                        looped = true;
                    }
                }
            }
            else
            {
                if (this._ratio <= this._targetRatio)
                {
                    if (this.repeatMode === RepeatMode.None || this._repeatCount === 0 || this._targetRatio > 0)
                    {
                        this._ratio = this._targetRatio;
                        this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1);
                        this._updateEvent.enabled = false;
                        ended = true;
                    }
                    else
                    {
                        if (this.repeatMode === RepeatMode.Loop)
                        {
                            this._ratio = 1 + this._ratio; // ratio is negative, it is the inverse of the overstep, adding 1 makes it go from the other side.
                            this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1);
                            this._indexTimeCode = this._arrayTimeCodeEvent.length-1;
                        }
                        else if (this.repeatMode === RepeatMode.PingPong)
                        {
                            this._goingUp = true;
                            this._ratio = -this._ratio;
                            this._clampedRatio = Math.min(Math.max(this._ratio, 0), 1);
                            this._targetRatio = 1;
                            this._indexTimeCode = 0;
                        }

                        if (this._repeatCount > 0)
                        {
                            this._repeatCount--;
                        }

                        looped = true;
                    }
                }
            }
        }
        while (Math.abs(this._ratio) > 1)

        this.Update(this.Easing(this._clampedRatio));
        if (ended)
        {
            this.OnEnd(this._clampedRatio);
        }
        else if (looped)
        {
            this.OnLoop(this._clampedRatio);
        }
    }
    
    this._ResetIndexTimeCode = function()
    {
        var ind = -1;
        for (var i = 0; i < this._arrayTimeCodeEvent.length; i++)
        {
            if (this._arrayTimeCodeEvent[i].timeCode > this._clampedRatio)
            {
                ind = i;
                break;
            }
        }
        if (ind === -1)
        {
            this._indexTimeCode = this._arrayTimeCodeEvent.length;
        }
        else
        {
            this._indexTimeCode = ind;
        }
        if (!this._goingUp)
        {
            this._indexTimeCode = this._indexTimeCode - 1;
        }
    }
    //#endregion
};


// Function AnimationGroup, defined by an array of animations, a speed factor and a repeatMode
global.AnimationGroup = function(_obj, _animations, _speedFactor, _repeatMode)
{
    //#region public vars
    this.speedFactor = _speedFactor;
    //#endregion


    //#region private vars
    var _this = this;

    this._animations = _animations;
    this._animCount = this._animations.length;
    this._ratioRemap = [];
    this._currentAnim = 0;
    
    this._anim = new Animation(_obj, 1, function(ratio){_this._InternalUpdate(ratio);}, _repeatMode);
    //#endregion


    //#region public events
    this.Easing = function(r){return r}

    this.OnEnd = function(r){};
    this.OnStart = function(r){};
    this.OnLoop = function(r){};
    //#endregion


    //#region private events
    this._anim.OnEnd = function(r){_this._UpdateAllAnims(r); _this.OnEnd(r);};
    this._anim.OnStart = function(r){_this.OnStart(r);};
    this._anim.OnLoop = function(r){_this._UpdateAllAnims(r); _this.OnLoop(r);};
    //#endregion

    //#region public functions
    this.IsPlaying = function(){return this._anim.IsPlaying()};
    this.IsPaused = function(){return this._anim.IsPaused();};
    this.IsGoingUp = function(){return this._anim.IsGoingUp();};
    this.GetRatio = function(){return this._anim.GetRatio();};
    this.GetRepeatCount = function(){return this._anim.GetRepeatCount();};

    this.UpdateDuration = function ()
    {
        var durationTotal = 0;
        for (var i = 0; i < this._animCount; ++i)
        {
            durationTotal += this._animations[i].duration;
        }

        var durationAcc = 0;
        this._ratioRemap = [];
        
        for (var i = 0; i < this._animCount; ++i)
        {
            durationAcc += this._animations[i].duration;
            this._ratioRemap.push(durationAcc / durationTotal);
        }

        this._anim.duration = durationTotal / this.speedFactor;
    }

    this.Start = function (repeats)
    {
        repeats = repeats !== undefined ? repeats : 0;
        this._anim.Start(repeats, 0);
    }

    this.Reset = function ()
    {
        this._anim.Reset();
    }

    this.Pause = function ()
    {
        this._anim.Pause();
    }

    this.Resume = function ()
    {
        this._anim.Resume();
    }

    this.GoTo = function (target)
    {
        this._anim.GoTo(target);
    }

    this.JumpTo = function (target)
    {
        this._anim.JumpTo(target);
        this._UpdateAllAnims(target);
    }
    //#endregion


    //#region private functions
    this._InternalUpdate = function (ratio)
    {
        if (this._anim.IsGoingUp())
        {
            if (ratio >= 1)
            {
                this._animations[this._currentAnim].JumpTo(1);
            }
            else
            {
                var ratioStart = this._currentAnim > 0 ? this._ratioRemap[this._currentAnim - 1] : 0
                var ratioEnd = this._ratioRemap[this._currentAnim];
                var ratioCurrent = (ratio - ratioStart) / (ratioEnd - ratioStart);
                var clampedRatio = Math.min(Math.max(ratioCurrent, 0), 1);

                if (ratioCurrent > 1)
                {

                    do
                    {
                        this._animations[this._currentAnim].JumpTo(1);
                        this._currentAnim++;

                        ratioStart = this._currentAnim > 0 ? this._ratioRemap[this._currentAnim - 1] : 0
                        ratioEnd = this._ratioRemap[this._currentAnim];
                        ratioCurrent = (ratio - ratioStart) / (ratioEnd - ratioStart);
                        clampedRatio = Math.min(Math.max(ratioCurrent, 0), 1);
                        
                        this._animations[this._currentAnim].JumpTo(clampedRatio);
                    } while (ratioCurrent > 1)
                }
                else
                {
                    this._animations[this._currentAnim].JumpTo(clampedRatio);
                }
            }
        }
        else
        {
            if (ratio <= 0)
            {
                this._animations[this._currentAnim].JumpTo(0);
            }
            else
            {
                var ratioStart = this._currentAnim > 0 ? this._ratioRemap[this._currentAnim - 1] : 0
                var ratioEnd = this._ratioRemap[this._currentAnim];
                var ratioCurrent = (ratio - ratioStart) / (ratioEnd - ratioStart);
                var clampedRatio = Math.min(Math.max(ratioCurrent, 0), 1);
                
                if (ratioCurrent < 0)
                {
                    do
                    {
                        this._animations[this._currentAnim].JumpTo(0);
                        this._currentAnim--;

                        ratioStart = this._currentAnim > 0 ? this._ratioRemap[this._currentAnim - 1] : 0
                        ratioEnd = this._ratioRemap[this._currentAnim];
                        ratioCurrent = (ratio - ratioStart) / (ratioEnd - ratioStart);
                        clampedRatio = Math.min(Math.max(ratioCurrent, 0), 1);
                        
                        this._animations[this._currentAnim].JumpTo(clampedRatio);
                    } while (ratioCurrent < 0)
                }
                else
                {
                    this._animations[this._currentAnim].JumpTo(clampedRatio);
                }
            }
        }
    }

    this._UpdateAllAnims = function (ratio)
    {
        if (this._anim.IsGoingUp())
        {
            for (var i = this._animCount - 1; i >=0 ;--i)
            {
                var ratioStart = i > 0 ? this._ratioRemap[i - 1] : 0
                var ratioEnd = this._ratioRemap[i];
                var ratioCurrent = (ratio - ratioStart) / (ratioEnd - ratioStart);
                
                this._animations[i].JumpTo(Math.min(Math.max(ratioCurrent, 0), 1));
    
                if (ratioCurrent >= 0 && ratioCurrent <= 1)
                {
                    this._currentAnim = i;
                }
            }
        }
        else
        {
            for (var i = 0; i < this._animCount; ++i)
            {
                var ratioStart = i > 0 ? this._ratioRemap[i - 1] : 0
                var ratioEnd = this._ratioRemap[i];
                var ratioCurrent = (ratio - ratioStart) / (ratioEnd - ratioStart);
                
                this._animations[i].JumpTo(Math.min(Math.max(ratioCurrent, 0), 1));

                if (ratioCurrent >= 0 && ratioCurrent <= 1)
                {
                    this._currentAnim = i;
                }
            }
        }
    }
    //#endregion

    // Call to force the duration to be correct when initializing
    this.UpdateDuration();
}