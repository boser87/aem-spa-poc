package com.accenture.aem.core.models;

import javax.annotation.PostConstruct;
import javax.servlet.http.Cookie;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.WCMMode;

@Model(adaptables=SlingHttpServletRequest.class)
public class User {
	
    private final Logger logger = LoggerFactory.getLogger(getClass());

	@Self
	private SlingHttpServletRequest request;
	
	private String userName;
	private Group group;

    @PostConstruct
    protected void init() {
    	WCMMode wcmMode = WCMMode.fromRequest(request);
    	
    	if(!wcmMode.equals(WCMMode.DISABLED)) {
    		group = Group.AUTHOR;
    	} else {
    		Cookie userCookie = request.getCookie("spa-poc-user");
    		Cookie userGroupCookie = request.getCookie("spa-poc-user-group");
    		if(userCookie == null || userGroupCookie == null) {
    			group = Group.ANONYMOUS;
    		} else {
    			try {
    				group = Group.valueOf(userGroupCookie.getValue());
    			} catch(IllegalArgumentException ex) {
    		        logger.info("Group with value [%s] is not handled!", ex);
    		        group = Group.ANONYMOUS;
    			}
    		}
    	}
    }
    
    public Group getGroup() {
		return group;
	}
    
    public String getUserName() {
		return userName;
	}
    
}
