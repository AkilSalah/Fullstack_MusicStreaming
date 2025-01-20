package com.music.service.implementation;

import com.music.service.interfaces.BlackListToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class BlackListImlp implements BlackListToken {
    List<String> BlackTokens = new ArrayList<>();

    @Override
    public void AddToken(String token) {
        BlackTokens.add(token);
    }

    @Override
    public Boolean GetTokens(String token) {
        return BlackTokens.contains(token);
    }
}
