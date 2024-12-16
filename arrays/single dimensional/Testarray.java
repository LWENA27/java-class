public class Testarray {
    public static void main(String[] args) {
        int a[]=new int[5]; //declaration and instantion
        a[0]=10; //initialization
        a[1]=20;
        a[2]=70;
        a[3]=40;
        a[4]=50;
        //a[5]=100;  //this will result to error since declaled array are of 5 element
        for(int i=0;i<a.length;i++){
            System.out.println(a[i]);
        }
    }
    
}
