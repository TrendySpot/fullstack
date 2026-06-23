package com.spotz.controller;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * React SPA 새로고침 문제 해결 컨트롤러
 *
 * 문제: 브라우저에서 직접 URL(예: /posts/1)을 입력하거나 새로고침하면
 *       Spring Boot가 해당 경로를 찾지 못해 404 에러 발생
 *
 * 해결: 모든 에러 요청을 React의 index.html(/)로 포워딩하여
 *       React Router가 클라이언트 사이드에서 라우팅하도록 처리
 */
@Controller
public class WebController implements ErrorController {

    private static final String ERROR_PATH = "/error";

    @RequestMapping(value = ERROR_PATH)
    public ModelAndView handleError() {
        // React 빌드 결과물의 index.html로 포워딩
        return new ModelAndView("forward:/index.html");
    }
}