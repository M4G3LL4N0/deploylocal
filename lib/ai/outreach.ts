// Generate outreach messages for a lead
export function generateOutreachMessage(lead: any, sitePreviewUrl: string) {
  const { business_name, category, city, has_website } = lead;
  
  // Personalization elements
  const business = business_name || "your business";
  const location = city ? `in ${city}` : "";
  const industry = category ? `for ${category} businesses` : "";
  const websiteStatus = has_website 
    ? "your current website" 
    : "website";
  
  // Cold call script (approximately 30-45 seconds)
  const callScript = `Hi, is this the owner or manager of ${business}? 

Great, I'm calling because I noticed ${business} ${location} ${industry} could really benefit from a stronger online presence. 

I've actually created a free preview of what a professional website could look like for your business - you can check it out at ${sitePreviewUrl}. 

It takes just 2 minutes to see how this could help you get more customers online. 

When would be a good time to walk you through it?`;

  // SMS message (under 160 characters for single segment)
  const sms = `Hi ${business_name.split(' ')[0]}! I created a free website preview for ${business} at ${sitePreviewUrl}. No obligation - just wanted to show how we help ${category || 'local'} businesses get more customers. Reply STOP to opt out.`;

  // Email subject and body
  const emailSubject = `Free website preview for ${business}`;
  const emailBody = `Hi there,

I hope this message finds you well. I've been looking at ${business} ${location} and noticed an opportunity to strengthen your online presence.

I've actually put together a free, no-obligation preview of what a professional website could look like for your business - specifically designed to help ${category || 'local'} businesses like yours attract more customers.

You can view your preview here: ${sitePreviewUrl}

This preview includes:
- Mobile-friendly design
- Clear call-to-action for customers
- Basic SEO optimization
- Fast loading times

If you like what you see, I'd be happy to discuss how we can get this live for you. If not, no worries at all - consider this my gift to you for taking the time to look.

Either way, I hope you have a great week!

Best regards,
The DeployLocal Team`;

  return {
    callScript: callScript.trim(),
    sms: sms.trim(),
    email: {
      subject: emailSubject,
      body: emailBody.trim()
    }
  };
}
