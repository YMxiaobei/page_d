<div id="data-edit">
    <div id="data-edit-main" class="block">
        <div class="side-left">
            <a href="javascript:;" id="btn1" class="v-center">运营数据</a>
            <a href="javascript:;" id="btn2" class="v-center">活动编辑</a>
            <a href="javascript:;" id="btn3" class="v-center">人物编辑</a>
            <a href="javascript:;" id="btn4" class="v-center">基础信息</a>
        </div>
        <div class="side-right">
            <div id="calendar-container" class="block">
                <div class="calendar-header"><div class="nest v-center"> > </div><div class="back v-center"> < </div><div class="date v-center"><span id="year-no">...</span>年<span id="month-no">...</span>月</div></div>
                <div class="calendar-header-week">
                    <ul>
                        <li class="v-center">星期日</li>
                        <li class="v-center">星期一</li>
                        <li class="v-center">星期二</li>
                        <li class="v-center">星期三</li>
                        <li class="v-center">星期四</li>
                        <li class="v-center">星期五</li>
                        <li class="v-center">星期六</li>
                    </ul>
                </div>
                <div class="date-container">
                    <ul>
                        <?php
                        for ( $i = 0; $i < 42; $i++ ) {
                            echo "<li></li>";
                        }
                        ?>      
                    </ul>
                </div>
            </div>
            <div id="face-edit" class="block"></div>
            <div id="base-imformation" class="block"></div>
            <div id="re">
                  <div id="re-side-left">
                      <canvas id="ctx11" width="130px" height="40px"></canvas>
                  </div>
                  <div id="re-side-right">
                      <div id="re-side-right-cover"></div>
                  </div>
                  <div id="re-cover"></div>
            </div>  
        </div>
    </div> 
</div>