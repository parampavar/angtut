using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProcessFiles
{
    [Serializable]
    public class Address
    {
	//@SerializedName("Street1")
        private String _street1;

        public String Street1
        {
            get { return _street1; }
            set { _street1 = value; }
        }
	
	//@SerializedName("Street2")
        private String _street2;

        public String Street2
        {
            get { return _street2; }
            set { _street2 = value; }
        }
	
	//@SerializedName("City")
        private String _city;

        public String City
        {
            get { return _city; }
            set { _city = value; }
        }
	
	//@SerializedName("State")
        private String _state;

        public String State
        {
            get { return _state; }
            set { _state = value; }
        }
	
	//@SerializedName("PostalCode")
        private String _postalcode;

        public String Postalcode
        {
            get { return _postalcode; }
            set { _postalcode = value; }
        }
	
	//@SerializedName("Country")
        private String _country;

        public String Country
        {
            get { return _country; }
            set { _country = value; }
        }
    }
}
