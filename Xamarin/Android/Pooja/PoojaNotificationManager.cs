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

namespace Pooja
{
    //
    // Class used to manage audio notifications.
    //
    class PoojaNotificationManager
    {
        static public AudioManager audioManager = null;
		static public NotificationManager notifyManager = null;

        static Activity mainActivity = null;

        public static Activity MainActivity {
            set { mainActivity = value; }
        }

        AudioManager.IOnAudioFocusChangeListener listener = null;

        private class FocusChangeListener :  Java.Lang.Object, AudioManager.IOnAudioFocusChangeListener
        {
            INotificationReceiver parent = null;
			string fileName = null;
			Activity mainActivity;

			public FocusChangeListener (Activity mainActivity, INotificationReceiver parent, string fileName)
            {
                this.parent = parent;
				this.fileName = fileName;
				this.mainActivity = mainActivity;
            }

 
            public void OnAudioFocusChange (AudioFocus focusChange)
            {    
                switch (focusChange) {
                // We will take any flavor of AudioFocusgain that the system gives us and use it.
                case AudioFocus.GainTransient:
                case AudioFocus.GainTransientMayDuck:
                case AudioFocus.Gain:
					//parent.Start (mainActivity, this.fileName);
					//SetStatus ("Granted");
                    break;
                // If we get any notificationthat removes focus - just terminate what we were doing.
                case AudioFocus.LossTransientCanDuck:          
                case AudioFocus.LossTransient:
                case AudioFocus.Loss:
                    parent.Stop ();
					//SetStatus ("Removed");
                    break;
                default:
                    break;
                }
            }
        }

		public Boolean RequestAudioResources (Activity mainActivity, INotificationReceiver parent, string fileName)
        {
			listener = new FocusChangeListener ( mainActivity, parent, fileName);

            var ret = audioManager.RequestAudioFocus (listener, Stream.Music, AudioFocus.Gain);
            if (ret == AudioFocusRequest.Granted) {
                return (true);
            } else if (ret == AudioFocusRequest.Failed) {
                return (false);
            }
            return (false);
        }

        public void ReleaseAudioResources ()
        {
            if (listener != null)
                audioManager.AbandonAudioFocus (listener);
        }
    }
}