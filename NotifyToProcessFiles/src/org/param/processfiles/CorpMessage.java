package org.param.processfiles;

import java.io.Serializable;

public class CorpMessage implements Serializable {
	
	private String _text;
	private String _subject;
	
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

}
