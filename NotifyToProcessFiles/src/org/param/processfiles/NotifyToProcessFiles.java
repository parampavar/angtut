package org.param.processfiles;

import java.io.IOException;
import java.util.Scanner;
import java.util.Timer;

import javax.jms.JMSException;

public class NotifyToProcessFiles {


	/**
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws JMSException, IOException {
		
		System.out.println("Sending Enter 'exit' to stop");
		
		Consumer c = new Consumer();
		
		
		Timer timer = new Timer("Printer");
		TimedNotifier t = new TimedNotifier();
		timer.schedule(t, 0, 1000);
		
		
		Scanner scan = new Scanner(System.in);
		
		boolean keepRunning = true;
		String name = null;
	    while (keepRunning)  {         
    		name =  scan.nextLine();  
	        if ("exit".equals(name))  
	        {  
	        	keepRunning = false;  
	        }  
            else  
            {  
                System.out.println("Hello " + name);  
            }  
        }
        
		
	}

}
