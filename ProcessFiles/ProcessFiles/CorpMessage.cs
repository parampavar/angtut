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
	    //@SerializedName("BooleanFlag") 
        private bool _bFlag;

        public bool BooleanFlag
        {
            get { return _bFlag; }
            set { _bFlag = value; }
        }

	    //@SerializedName("ByteCode") 
        private sbyte _byCode;

        public sbyte ByteCode
        {
            get { return _byCode; }
            set { _byCode = value; }
        }

	    //@SerializedName("CharYN") 
        private char _cYN;

        public char CharYN
        {
            get { return _cYN; }
            set { _cYN = value; }
        }

	    //@SerializedName("ShortNumber") 
        private short _shNumber;

        public short ShortNumber
        {
            get { return _shNumber; }
            set { _shNumber = value; }
        }
	
	    //@SerializedName("IntNumber") 
        private int _iNumber;

        public int IntNumber
        {
            get { return _iNumber; }
            set { _iNumber = value; }
        }
	
	    //@SerializedName("LongNumber") 
        private long _lNumber;

        public long LongNumber
        {
            get { return _lNumber; }
            set { _lNumber = value; }
        }
	
	    //@SerializedName("FloatNumber") 
        private float _fNumber;

        public float FloatNumber
        {
            get { return _fNumber; }
            set { _fNumber = value; }
        }
	
	    //@SerializedName("DoubleNumber") 
        private double _dNumber;

        public double DoubleNumber
        {
            get { return _dNumber; }
            set { _dNumber = value; }
        }


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

        private DateTime _dtStartDate;

        public DateTime StartDate
        {
            get { return _dtStartDate; }
            set { _dtStartDate = value; }
        }
        private DateTime _dtEndDate;

        public DateTime EndDate
        {
            get { return _dtEndDate; }
            set { _dtEndDate = value; }
        }

        public CorpMessage()
        {
        }
    }
}
