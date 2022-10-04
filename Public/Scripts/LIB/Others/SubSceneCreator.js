// -----JS CODE-----

global.CreateSubSceneWithAnim = function (_script, _subSceneParent, _animDuration, _animUpdate)
{
    var anim = new global.Animation(_animDuration, _animUpdate);
    anim.OnStart = function(){_subSceneParent.enabled = true;}
    anim.OnEnd = function(ratio){if (ratio <= 0) _subSceneParent.enabled = false;}

    var subScene = new global.SubScene(_script, _subSceneParent,
        function(){anim.GoTo(1);},
        function(){anim.GoTo(0);},
        function(){anim.JumpTo(1); _subSceneParent.enabled = true;},
        function(){anim.JumpTo(0); _subSceneParent.enabled = false;});
    
    return [subScene, anim];
}


global.CreateSubSceneWithAudio = function (_script, _subSceneParent, _animDuration, _audioComponent, _volumeStart, _loopCount)
{
    var anim = new global.Animation(_animDuration, AudioAnim);
    anim.OnStart = Start;
    anim.OnEnd = End;

    var subScene = new global.SubScene(_script, _subSceneParent,
        function(){anim.GoTo(1);},
        function(){anim.GoTo(0);},
        ShowInstant,
        HideInstant);
    
    function AudioAnim (ratio)
    {
        _audioComponent.volume = ratio * _volumeStart;
    }

    function Start ()
    {
        _subSceneParent.enabled = true;
        _audioComponent.play(_loopCount);
    }

    function End (ratio)
    {
        if (ratio <= 0)
        {
            _subSceneParent.enabled = false;
            if (_audioComponent.isPlaying())
            {
                _audioComponent.stop(false);
            }
        }
    }

    function ShowInstant ()
    {
        anim.GoTo(1);
        _subSceneParent.enabled = true;
        _audioComponent.play(_loopCount);
    }

    function HideInstant ()
    {
        anim.JumpTo(0);
        _subSceneParent.enabled = true;
        if (_audioComponent.isPlaying())
        {
            _audioComponent.stop(false);
        }
    }

    return [subScene, anim];
}