package com.music.service.interfaces;

import java.util.List;

public interface BlackListToken {
    void AddToken(String token);
    Boolean GetTokens(String token);

}
