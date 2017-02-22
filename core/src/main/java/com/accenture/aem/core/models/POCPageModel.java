package com.accenture.aem.core.models;

import java.util.Iterator;
import java.util.StringJoiner;

import javax.annotation.PostConstruct;
import javax.jcr.Session;

import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.WCMMode;

@Model(adaptables=SlingHttpServletRequest.class)
public class POCPageModel {

    protected final Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Self
	private SlingHttpServletRequest request;
	
	private WCMMode wcmMode;

	private String userGroups;

	private String userID;

    @PostConstruct
    protected void init() {
    	try {
    	wcmMode = WCMMode.fromRequest(request);
    	
    	ResourceResolver resourceResolver = request.getResourceResolver();
        Session session = resourceResolver.adaptTo(Session.class);
        UserManager userManager = resourceResolver.adaptTo(UserManager.class);
        /* to get the current user */
        Authorizable auth = userManager.getAuthorizable(session.getUserID());
        
        /* to get the groups it is member of */
    	Iterator<Group> groups = auth.memberOf();
    	StringJoiner joiner = new StringJoiner(",");
        while (groups.hasNext()) {
          Group group = groups.next();
          joiner.add(group.getID());
        }
        
        this.userGroups = joiner.toString(); 
        this.userID = auth.getID();
    	} catch(Exception ex) {
        	log.error("Error while retrieving user data!");
    	}
    }
    
    public String getMetaWcmMode() {
    	return wcmMode.toString();
    }
    
    public String getUserGroups() {
		return userGroups;
	}
    
    public String getUserID() {
		return userID;
	}
    
    public boolean isCustomer() {
    	return userGroups != null && userGroups.contains("customer");
    }
    
    public boolean isAdvisor() {
    	return userGroups != null && userGroups.contains("advisor");
    }
}
