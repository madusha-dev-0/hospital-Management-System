package com.smartcare.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("patitent")
public class Patient {

    @GetMapping("/")
    public String display(){
        return  "Hello java";
    }

}
