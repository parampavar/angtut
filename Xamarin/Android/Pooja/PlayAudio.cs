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
		int currentIndex = -1;
		Activity parentActivity = null;

		public void strtPlayer (int index)
        {
            try 
			{
                if (player == null) 
				{
					currentIndex = 0;
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
				{ 
					player.Reset();
					if (currentIndex == songs.Length)
						currentIndex = 0;
					prepareToPlay(currentIndex);
				}
            } catch (Exception ex) {
                Console.Out.WriteLine (ex.StackTrace);
            }
        }

		private void prepareToPlay(int index)
		{
			try
			{
				if ( songs.Length > 0 )
				{
					Console.Out.WriteLine ("Playing " + songs[index]);
					createNotification("Playing " + songs[index]);
					AssetFileDescriptor afd = parentActivity.Assets.OpenFd(songs[index]);
					if ( afd != null )
					{
						player.SetDataSource(afd.FileDescriptor,afd.StartOffset, afd.Length);
						afd.Close();
						player.Prepare ();
						player.Start ();
					}
				}
				else
					Console.Out.WriteLine ("Playlist is empty");
			}
			catch(Java.IO.FileNotFoundException fnf) {
				if (fnf.InnerException == null)
					Console.Out.WriteLine ("Exception:" + fnf.Message);
				else
					Console.Out.WriteLine ("Exception:" + fnf.InnerException.Message);
			}
			catch(Exception ex)
			{
				if (ex.InnerException == null)
					Console.Out.WriteLine ("Exception:" + ex.Message);
				else
					Console.Out.WriteLine ("Exception:" + ex.InnerException.Message);
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
				currentIndex = -1;
				//player = null;
            }
        }

		public void Start (Activity mainActivity, string[] songs)
        {
			this.songs = songs;
			this.parentActivity = mainActivity;
			this.currentIndex++;
			strtPlayer(currentIndex);
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

		public void createNotification(string msg) {

			Notification notification = new Notification(Resource.Drawable.Icon, msg, System.Environment.TickCount);
			notification.SetLatestEventInfo(this.parentActivity.ApplicationContext, text, msg, null);
			PoojaNotificationManager.notifyManager.Notify(0, notification);

		}
    }

}


