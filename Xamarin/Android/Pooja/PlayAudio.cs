using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.Media;
using Android.Content.Res;


namespace Pooja
{
    //
    // Shows how to use the MediaPlayer class to play audio.
	class PlayAudio : INotificationReceiver
    {
        MediaPlayer player = null;
		string[] songs = null;
		int currentIndex = 0;
		Activity parentActivity = null;

		public void strtPlayer (int index)
        {
            try 
			{
                if (player == null) 
				{
					player = new MediaPlayer();
					player.Completion += (object sender, EventArgs e) => 
					{
						currentIndex++;
						player.Reset();
						if (currentIndex == songs.Length)
							currentIndex = 0;
						prepareToPlay(currentIndex);
					};
					prepareToPlay(currentIndex);
				}
				else 
					prepareToPlay(currentIndex);
            } catch (Exception ex) {
                Console.Out.WriteLine (ex.StackTrace);
            }
        }

		private void prepareToPlay(int index)
		{
			try
			{
				// This method works better than setting the file path in SetDataSource. Don't know why.
				Console.Out.WriteLine ("playing ;" + songs[index]);
				AssetFileDescriptor afd = parentActivity.Assets.OpenFd(songs[index]);
				if ( afd != null )
				{
					player.SetDataSource(afd.FileDescriptor,afd.StartOffset, afd.Length);
					afd.Close();
					player.Prepare ();
					player.Start ();
				}
			}
			catch(Exception ex)
			{
				Console.Out.WriteLine (ex.StackTrace);
			}
		}

        public void StopPlayer ()
        {
            if ((player != null)) {
                if (player.IsPlaying) {
                    player.Stop ();
                }
				player.Reset ();
                player.Release ();
				//player = null;
            }
        }

		public void Start (Activity mainActivity, string[] songs)
        {
			this.songs = songs;
			this.parentActivity = mainActivity;
			strtPlayer(0);
        }

		public void Next ()
		{
			this.currentIndex++;
			strtPlayer(currentIndex);
		}

		public void Stop ()
        {
            this.StopPlayer ();
        }

    }

}


