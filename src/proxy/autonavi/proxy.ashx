<%@ WebHandler Language="C#" Class="proxy" %>

using System;
using System.Web;
using System.IO;

public class proxy : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        //string url=context.Request.
        //string uri = context.Request.Url.Query.Substring(1);
        string url = context.Request.Url.Query.Substring(1);
        System.Net.WebRequest request = System.Net.WebRequest.Create(new Uri(url));
        request.Method = context.Request.HttpMethod;
        request.ContentType = "application/x-www-form-urlencoded";

        System.Net.WebResponse response = request.GetResponse();
        Stream stream = response.GetResponseStream();

        BinaryReader br = new BinaryReader(stream);
        byte[] outb = br.ReadBytes((int)response.ContentLength);
        br.Close();

        // Tell client not to cache the image since it's dynamic
        //context.Response.CacheControl = "no-cache";

        // Send the image to the client
        // (Note: if large images/files sent, could modify this to send in chunks)
        context.Response.OutputStream.Write(outb, 0, outb.Length);
        
        stream.Close();
        response.Close();
        context.Response.End(); 
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}