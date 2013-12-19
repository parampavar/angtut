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
		//static string filePath = "/data/data/Pooja.Pooja/files/"; // testAudio.mp4";
		//static string filePath = "/data/Pooja.Pooja/files/"; // testAudio.mp4";
		//static string filePath = "/Pooja.Pooja/files/"; // testAudio.mp4";
		static string filePath = "/Pooja.Pooja/files/"; // testAudio.mp4";
		//static string filePath = "/data/data/Example_WorkingWithAudio.Example_WorkingWithAudio/files/testAudio.mp4";

		public void strtPlayer (Activity mainActivity, string fileName)
        {
			this.StopPlayer ();

            try {
                if (player == null) 
				{
                    player = new MediaPlayer ();
                } 
				else 
				{
                    player.Reset ();
                }

                // This method works better than setting the file path in SetDataSource. Don't know why.
				//Java.IO.File file = new Java.IO.File (filePath + fileName);
				Console.Out.WriteLine ("playing ;" + fileName);
				AssetFileDescriptor asd = mainActivity.Assets.OpenFd(fileName);
				//Java.IO.FileInputStream fis = new Java.IO.FileInputStream( asd.FileDescriptor);
				player.SetDataSource(asd.FileDescriptor,asd.StartOffset, asd.Length);

				//player.SetDataSource (fis.FD);
 
                player.Prepare ();
                player.Start ();
            } catch (Exception ex) {
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
                player = null;
            }
        }

		public void Start (Activity mainActivity,string fileName)
        {
			strtPlayer (mainActivity, fileName);
        }

        public void Stop ()
        {
            this.StopPlayer ();
        }

    }

}