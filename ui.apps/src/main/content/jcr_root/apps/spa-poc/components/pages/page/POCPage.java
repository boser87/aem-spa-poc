package apps.spa_poc.components.pages.page;

import com.adobe.cq.sightly.WCMUse;
import com.adobe.cq.sightly.SightlyWCMMode;

import java.util.Iterator;
import java.util.StringJoiner;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.Group;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
*
* This must become a SlingModel 
**/
public class POCPage extends WCMUse {
    private SightlyWCMMode _sightlyWCMMode;
    private boolean _isSearchEngine = false;
    private Authorizable auth;
    protected final Logger log = LoggerFactory.getLogger(this.getClass());
    private String userGroups = null;
    private String userID = null;

    @Override
    public void activate() throws Exception {
        this._sightlyWCMMode = this.getWcmMode();
        try {
        Session session = this.getResourceResolver().adaptTo(Session.class);
        UserManager userManager = this.getResourceResolver().adaptTo(UserManager.class);
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

    public String getIsPublisher() {
    	    	
        if(this._sightlyWCMMode.isEdit() || this._sightlyWCMMode.isDesign()) {
            return "false";
        }
        else if(this._sightlyWCMMode.isPreview()){
        	// PREVIEW HAS TO RELOAD THE PAGE
                return "false";
        }else{
            return "true";
        }
        
    }

    public boolean getIsSearchEngine(){
        String[] selectors = this.getRequest().getRequestPathInfo().getSelectors();

        for(String selector : selectors){
            if(selector.equalsIgnoreCase("searchengine")){
                this._isSearchEngine = true;
                break;
            }
        }

        return this._isSearchEngine;
    }

    public boolean getUseRouter() {
        boolean isPublisher = Boolean.parseBoolean(getIsPublisher());
        if(!this.getIsSearchEngine()) {
            return isPublisher;
        }else{
            return false;
        }
    }

    public String getMetaWcmMode(){
        return this._sightlyWCMMode.toString();
    }
    
    public String getUserGroups() {
    	return this.userGroups;
    }
    
    public String getUserID() {
        return this.userID;
    }    
    
}