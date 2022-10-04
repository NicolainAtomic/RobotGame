// -----JS CODE-----
global.PlayVideo = function (provider, count)
{
	if (provider.getStatus() != VideoStatus.Preparing)
	{
		if (provider.getStatus() == VideoStatus.Playing
			|| provider.getStatus() == VideoStatus.Paused)
		{
			provider.stop();
		}
		if (provider.getStatus() != VideoStatus.Playing)
		{
            global.readyToPlay = true;
			provider.play(count);
		}
	}
}


global.StopVideo = function (provider)
{
	if (provider.getStatus() != VideoStatus.Stopped)
	{
		provider.stop();
	}
}


global.PauseVideo = function (provider)
{
	if (provider.getStatus() == VideoStatus.Playing)
	{
		provider.pause();
	}
	else if (provider.getStatus() == VideoStatus.Preparing)
	{
		print("WARNING : PauseVideo was called but the video was still preparing, call will be StopVideo.");
		provider.stop();
	}
}


global.ResumeVideo = function (provider)
{
	if (provider.getStatus() != VideoStatus.Playing)
	{
		if (provider.getStatus() == VideoStatus.Paused)
		{
			provider.resume();
		}
		else if (provider.getStatus() == VideoStatus.Stopped)
		{
			print("WARNING : ResumeVideo was called but the video was stopped (play count will be 1).");
			provider.play(1);
		}
	}
}