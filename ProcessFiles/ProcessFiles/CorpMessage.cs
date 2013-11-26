using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessFiles
{
    [Serializable]
    public class CorpMessage
    {
        private string _text;
        private string _subject;

        public string Subject
        {
            get { return _subject; }
            set { _subject = value; }
        }

        public string Text
        {
            get { return _text; }
            set { _text = value; }
        }

        public CorpMessage()
        {
        }
    }
}
