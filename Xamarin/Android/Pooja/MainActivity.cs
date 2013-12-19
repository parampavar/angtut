using System;
using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;
using Android.Media;

namespace Pooja
{
	[Activity (Label = "Pooja", MainLauncher = true)]
	public class MainActivity : Activity
	{
		int count = 1;
		int[] ganeshPics = {Resource.Drawable.Ganesha1, Resource.Drawable.Ganesha2, Resource.Drawable.Ganesha3, Resource.Drawable.Ganesha4, Resource.Drawable.Ganesha5, Resource.Drawable.Ganesha6, Resource.Drawable.Ganesha7};
		string[] ganeshSongs = {"Ganapathiye_Varuvaai.mp3",
			"Ganapathy Ghanapatah.mp3",
			"Ganapathy Stotram.mp3",
			"Ganesha Ashtakam.mp3",
			"Ganesha Dvadasha.mp3",
			"Ganesha Pancharatna.mp3",
			"Ganeshanyasaha.mp3",
			"neeye_En_Vazhvukku.mp3",
			"Vinayagane_Vinaitheerpavane.mp3"
		};

		PlayAudio playAudio = new PlayAudio ();
		NotificationManager nMan = new NotificationManager ();

		static public bool useNotifications = false;

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

			// Set our view from the "main" layout resource
			SetContentView (Resource.Layout.Main);

			NotificationManager.audioManager = (AudioManager)GetSystemService (Context.AudioService);
			NotificationManager.MainActivity = this;


			// Get our button from the layout resource,
			// and attach an event to it
			Button button = FindViewById<Button> (Resource.Id.myButton);
			button.Click += sayHello;

			//ImageView iv = FindViewById<ImageView> (Resource.Id.imageView1);
			//iv.SetImageResource (Resource.Drawable.Ganesha1);

		}
		public void sayHello(object sender, EventArgs e)
		{
			TextView lblMessage = FindViewById<TextView> (Resource.Id.lblMessage);

			int pic = count % 7;

			ImageView iv = FindViewById<ImageView> (Resource.Id.imageView1);
			iv.SetImageResource (ganeshPics[pic]);
			iv.SetAdjustViewBounds (true);

			startOperation (ganeshSongs);

			lblMessage.Text = string.Format ("{0} clicks!", count++);
		}

		void startOperation (string[] songs)
		{
			playAudio = new PlayAudio ();
			playAudio.Start (this, songs);
		}
	}
}


