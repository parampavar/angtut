package org.param.processfiles;

import java.io.Serializable;
import java.util.Date;

import com.google.gson.annotations.SerializedName;

public class CorpMessage implements Serializable {
	
	@SerializedName("Text") 
	private String _text;
	
	@SerializedName("Subject") 
	private String _subject;
	
	@SerializedName("BooleanFlag") 
	private boolean _bFlag;

	@SerializedName("ByteCode") 
	private byte _byCode;

	@SerializedName("CharYN") 
	private char _cYN;

	@SerializedName("ShortNumber") 
	private short _shNumber;
	
	@SerializedName("IntNumber") 
	private int _iNumber;
	
	@SerializedName("LongNumber") 
	private long _lNumber;
	
	@SerializedName("FloatNumber") 
	private float _fNumber;
	
	@SerializedName("DoubleNumber") 
	private double _dNumber;

	@SerializedName("StartDate") 
	private Date _dtStartDate;

	@SerializedName("EndDate") 
	private Date _dtEndDate;
	
	@SerializedName("HomeAddress")
	private Address _homeAddress;
	
	@SerializedName("WorkAddress")
	private Address _workAddress;
	
	public String get_text() {
		return _text;
	}

	public void set_text(String _text) {
		this._text = _text;
	}

	public String get_subject() {
		return _subject;
	}

	public void set_subject(String _subject) {
		this._subject = _subject;
	}

	public boolean is_bFlag() {
		return _bFlag;
	}

	public void set_bFlag(boolean _bFlag) {
		this._bFlag = _bFlag;
	}

	public byte get_byCode() {
		return _byCode;
	}

	public void set_byCode(byte _byCode) {
		this._byCode = _byCode;
	}

	public char get_cYN() {
		return _cYN;
	}

	public void set_cYN(char _cYN) {
		this._cYN = _cYN;
	}

	public short get_shNumber() {
		return _shNumber;
	}

	public void set_shNumber(short _shNumber) {
		this._shNumber = _shNumber;
	}

	public int get_iNumber() {
		return _iNumber;
	}

	public void set_iNumber(int _iNumber) {
		this._iNumber = _iNumber;
	}

	public long get_lNumber() {
		return _lNumber;
	}

	public void set_lNumber(long _lNumber) {
		this._lNumber = _lNumber;
	}

	public float get_fNumber() {
		return _fNumber;
	}

	public void set_fNumber(float _fNumber) {
		this._fNumber = _fNumber;
	}

	public double get_dNumber() {
		return _dNumber;
	}

	public void set_dNumber(double _dNumber) {
		this._dNumber = _dNumber;
	}

	public Date get_dtStartDate() {
		return _dtStartDate;
	}

	public void set_dtStartDate(Date _dtStartDate) {
		this._dtStartDate = _dtStartDate;
	}

	public Date get_dtEndDate() {
		return _dtEndDate;
	}

	public void set_dtEndDate(Date _dtEndDate) {
		this._dtEndDate = _dtEndDate;
	}

	public Address get_homeAddress() {
		return _homeAddress;
	}

	public void set_homeAddress(Address _homeAddress) {
		this._homeAddress = _homeAddress;
	}

	public Address get_workAddress() {
		return _workAddress;
	}

	public void set_workAddress(Address _workAddress) {
		this._workAddress = _workAddress;
	}

}
