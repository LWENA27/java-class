public class passmethodtoarray {
    void first(int arr[]){
        System.out.println(arr[1]);

    }
    void second(int arr[][]){
        System.out.println(arr[0][1]);
    }
    public static void main(String[] arg){
        passmethodtoarray b=new passmethodtoarray();
        int one[]={2,3,4};
        int two[][]={{34,12,6},{43,23,65}};
        b.first(one);
        b.second(two);
    }
    
}
