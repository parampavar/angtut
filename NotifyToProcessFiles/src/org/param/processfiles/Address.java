package org.param.processfiles;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class Address implements Serializable{
	@SerializedName("Street1")
	private String _street1;
	
	@SerializedName("Street2")
	private String _street2;
	
	@SerializedName("City")
	private String _city;
	
	@SerializedName("State")
	private String _state;
	
	@SerializedName("PostalCode")
	private String _postalcode;
	
	@SerializedName("Country")
	private String _country;

	public String get_street1() {
		return _street1;
	}

	public void set_street1(String _street1) {
		this._street1 = _street1;
	}

	public String get_street2() {
		return _street2;
	}

	public void set_street2(String _street2) {
		this._street2 = _street2;
	}

	public String get_city() {
		return _city;
	}

	public void set_city(String _city) {
		this._city = _city;
	}

	public String get_state() {
		return _state;
	}

	public void set_state(String _state) {
		this._state = _state;
	}

	public String get_postalcode() {
		return _postalcode;
	}

	public void set_postalcode(String _postalcode) {
		this._postalcode = _postalcode;
	}

	public String get_country() {
		return _country;
	}

	public void set_country(String _country) {
		this._country = _country;
	}

}
