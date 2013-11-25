using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessFiles
{
    class CorpMessage
    {
        private string _text;

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
