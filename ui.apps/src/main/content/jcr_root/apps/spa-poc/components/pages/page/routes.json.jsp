<%--
  ADOBE CONFIDENTIAL
  __________________

   Copyright 2013 Adobe Systems Incorporated
   All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.

  ----------
TODO: clean up the double route names

  angular-routes
--%><%
%><%@page session="false"
          import="com.day.cq.wcm.commons.WCMUtils"
          import="org.apache.sling.commons.json.io.*"
          import="java.util.*"
          import="com.day.cq.search.result.SearchResult"
          import="com.day.cq.search.result.Hit"
          import="com.day.cq.search.Query"
          import="com.day.cq.search.PredicateGroup"
          import="javax.jcr.Session"
          import="com.day.cq.search.QueryBuilder"
          import="com.accenture.aem.core.models.POCPageModel"%><%
%><%@include file="/libs/foundation/global.jsp" %>
<%
    	POCPageModel pocPageModel = slingRequest.adaptTo(POCPageModel.class);

    response.setContentType("application/json");
    response.setCharacterEncoding("utf-8");

    JSONWriter writer = new JSONWriter(response.getWriter());
    writer.object();

    String angularSiteHomePath = WCMUtils.getInheritedProperty(currentPage,resource.getResourceResolver(),"angularSiteHomePath");
    Page rootPage = resource.getResourceResolver().getResource(angularSiteHomePath).adaptTo(Page.class);

    Map<String, String> map = new HashMap<String, String>();
    map.put("path", angularSiteHomePath);
    map.put("type", "cq:Page");
    map.put("p.limit", "-1");

    QueryBuilder queryBuilder = resource.getResourceResolver().adaptTo(QueryBuilder.class);
    Session session = resource.getResourceResolver().adaptTo(Session.class);
    Query query = queryBuilder.createQuery(PredicateGroup.create(map), session);
    SearchResult result = query.getResult();

    if (rootPage != null) {
        for (Hit hit : result.getHits()) {

            String pagePath = hit.getPath();
            writer.key(pagePath);
            writer.object();
            writer.key("url");
            writer.value(pagePath + ".html");
            writer.key("views");
            writer.object();
            writer.key("navigation");
            writer.object();
            writer.key("templateUrl");
            writer.value(pagePath + ".header-partial.html");
            writer.endObject();
            writer.key("main");
            writer.object();            
            writer.key("templateUrl");
            writer.value(pagePath + ".main-partial.html");
            writer.endObject();
            writer.endObject();
            writer.endObject();
        }
    }

    if(pocPageModel.isAdvisor()) {
    	writer.key("home");
        writer.object();
        writer.key("url");

        String advisorHomePagePath = WCMUtils.getInheritedProperty(currentPage,resource.getResourceResolver(),"advisorHomePagePath");
        writer.value(advisorHomePagePath + ".html");

	        writer.key("views");
        	writer.object();
        	writer.key("navigation");

                writer.object();
                writer.key("templateUrl");
                writer.value(advisorHomePagePath + ".header-partial.html");
                writer.endObject();

                writer.key("main");
                writer.object();            
                writer.key("templateUrl");
                writer.value(advisorHomePagePath + ".main-partial.html");
                writer.endObject();

            writer.endObject();
            writer.endObject();


    } else if(pocPageModel.isCustomer()) {
    	writer.key("home");
        writer.object();
        writer.key("url");

        String customerHomePagePath = WCMUtils.getInheritedProperty(currentPage,resource.getResourceResolver(),"customerHomePagePath");
        writer.value(customerHomePagePath + ".html");

	        writer.key("views");
        	writer.object();
        	writer.key("navigation");

                writer.object();
                writer.key("templateUrl");
                writer.value(customerHomePagePath + ".header-partial.html");
                writer.endObject();

                writer.key("main");
                writer.object();            
                writer.key("templateUrl");
                writer.value(customerHomePagePath + ".main-partial.html");
                writer.endObject();

            writer.endObject();
            writer.endObject();

    }

    writer.endObject();
%>