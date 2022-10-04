// -----JS CODE-----

var hintComponent = script.getSceneObject().createComponent( "Component.HintsComponent" );


global.ShowHintFace = function (duration)
{
    hintComponent.showHint("lens_hint_find_face", duration);
}


global.HideHintFace = function ()
{
    hintComponent.hideHint("lens_hint_find_face");
}


global.ShowHintSky = function (duration)
{
    hintComponent.showHint("lens_hint_aim_camera_at_the_sky", duration);
}


global.HideHintSky = function ()
{
    hintComponent.hideHint("lens_hint_aim_camera_at_the_sky");
}


global.ShowHintSwapCam = function (duration)
{
    hintComponent.showHint("lens_hint_swap_camera", duration);
}


global.HideHintSwapCam = function ()
{
    hintComponent.hideHint("lens_hint_swap_camera");
}