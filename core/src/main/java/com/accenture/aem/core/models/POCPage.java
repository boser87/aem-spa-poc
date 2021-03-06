/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.accenture.aem.core.models;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import com.day.cq.wcm.api.WCMMode;

@Model(adaptables=SlingHttpServletRequest.class)
public class POCPage {

	@Self
	private SlingHttpServletRequest request;
	
	private boolean useRouter;
	private WCMMode wcmMode;
	private boolean isSearchEngine;
	private boolean isPublisher;

    @PostConstruct
    protected void init() {
    	wcmMode = WCMMode.fromRequest(request);
    }
    
    public boolean useRouter() {
		return useRouter;
	}
    
    public boolean isSearchEngine() {
		return isSearchEngine;
	}
    
    public boolean isPublisher() {
		return isPublisher;
	}
    
    public String getMetaWcmMode() {
    	return wcmMode.toString();
    }
}
