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
	public class MainActivity : Activity, ViewSwitcher.IViewFactory
	{
		int[] ganeshPics = {Resource.Drawable.Ganesha1, Resource.Drawable.Ganesha3, Resource.Drawable.Ganesha4, Resource.Drawable.Ganesha5, Resource.Drawable.Ganesha6, Resource.Drawable.Ganesha7};
		//int[] ganeshPics = {Resource.Drawable.Ganesha1, Resource.Drawable.Ganesha2, Resource.Drawable.Ganesha3, Resource.Drawable.Ganesha4, Resource.Drawable.Ganesha5, Resource.Drawable.Ganesha6, Resource.Drawable.Ganesha7};
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

		Action atnSwitchImage;
		int currentImage = 0;

		static public int SWITHIMAGEDURATION = 1500;

		static public bool useNotifications = false;

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);
			RequestWindowFeature (WindowFeatures.NoTitle);

			// Set our view from the "main" layout resource
			SetContentView (Resource.Layout.Main);

			NotificationManager.audioManager = (AudioManager)GetSystemService (Context.AudioService);
			NotificationManager.MainActivity = this;


			// Get our button from the layout resource,
			// and attach an event to it
			Button button1 = FindViewById<Button> (Resource.Id.btnStart);
			button1.Click += btnStart_Click;
			Button button2 = FindViewById<Button> (Resource.Id.btnNext);
			button2.Click += btnNext_Click;

			atnSwitchImage = delegate {
				switchImage ();
			};

			ImageSwitcher iv = FindViewById<ImageSwitcher> (Resource.Id.switcher);
			iv.SetFactory (this);
			iv.SetInAnimation (this, Android.Resource.Animation.FadeIn);
			iv.SetOutAnimation (this, Android.Resource.Animation.FadeOut);
			iv.PostDelayed(atnSwitchImage, SWITHIMAGEDURATION );

			btnStart_Click (null, null);

		}

		public void switchImage()
		{
			currentImage++;
			if (currentImage == ganeshPics.Length)
				currentImage = 0;
			ImageSwitcher iv = FindViewById<ImageSwitcher> (Resource.Id.switcher);
			iv.SetImageResource (ganeshPics[currentImage]);
			iv.PostDelayed(atnSwitchImage, SWITHIMAGEDURATION );
		}

		public View MakeView()
		{
			ImageView i = new ImageView (this);
			//i.SetBackgroundColor (Android.Graphics.Color.Azure);
			i.SetScaleType (ImageView.ScaleType.CenterInside);
			i.SetAdjustViewBounds (true);
			//i.LayoutParameters = new ImageSwitcher.LayoutParams(ImageSwitcher.LayoutParams.WrapContent,ImageSwitcher.LayoutParams.WrapContent);
			i.LayoutParameters = new ImageSwitcher.LayoutParams(ImageSwitcher.LayoutParams.FillParent,ImageSwitcher.LayoutParams.FillParent);
			return i;
		}

		public void btnStart_Click(object sender, EventArgs e)
		{
			startOperation (ganeshSongs);
		}

		public void btnNext_Click(object sender, EventArgs e)
		{
			nextSong();
		}

		void startOperation (string[] songs)
		{
			playAudio = new PlayAudio ();
			playAudio.Start (this, songs);
		}
		void nextSong ()
		{
			if ( playAudio == null )
				playAudio = new PlayAudio ();
			playAudio.Next ();
		}
	}
}


