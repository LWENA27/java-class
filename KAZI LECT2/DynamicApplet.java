import java.applet.Applet;
import java.awt.Graphics;
import java.util.Date;

/*
<applet code="DynamicApplet" width="300" height="200"></applet>
*/
public class DynamicApplet extends Applet {
    @Override
    public void paint(Graphics g) {
        // Display current time
        g.drawString("Current time: " + new Date(), 20, 100);
    }
}
