var select = function (originData) {
    var uniqueKey = '';
    var searchBar;
    var searchBox;
    var selectedBox;
    var checkedNodes = ',';
    var i;
    var SCROLL_COUNT = 0;

    function setEventSearchBar() {
        searchBar.on('keyup', function (e) {
            searchBox.empty();
            if(searchBar[0].value.length > 1) {
                for(i = 0 ; i < originData.length ; i ++) {
                    if (originData[i].text.match(new RegExp(searchBar[0].value, 'gi')) && !checkedNodes.match(',' + originData[i].id + ',')) {
                        var data = {
                            key: uniqueKey,
                            id: originData[i].id,
                            text: originData[i].text,
                            count: i
                        };

                        drowSeachElement(data);
                    }
                }
            } else {
                SCROLL_COUNT = 0;
                infiniteScroll();
            }
        });

        searchBar.on('focus', function (e) {
            searchBox.empty();
            searchBox.css('display', 'block');
            searchBox[0].scrollTop = 0;
            SCROLL_COUNT = 0;
            infiniteScroll();
        });

        searchBar.on('blur', function (e) {
            setTimeout(function () {
                searchBar[0].value = '';
                searchBox.empty();
                searchBox.css('display', 'none');
                searchBox[0].scrollTop = 0;
                SCROLL_COUNT = 0;
            }, 200);
        });

        searchBox.on('scroll', function (e) {
            if(searchBox[0].scrollHeight < searchBox[0].scrollTop + 400){
                infiniteScroll();
            }
        });
    }

    function infiniteScroll() {
        var COUNT = 0;

        for(COUNT = 0 ; COUNT < 100 ; COUNT++) {
            if (!checkedNodes.match(',' + originData[SCROLL_COUNT].id + ',')){
                var data = {
                    key : uniqueKey,
                    id : originData[SCROLL_COUNT].id,
                    text : originData[SCROLL_COUNT].text,
                    count : SCROLL_COUNT
                };

                drowSeachElement(data);
            }
            SCROLL_COUNT = SCROLL_COUNT + 1;
        }
    }

    function drowSeachElement(data) {
        var elementId = data.id + data.key;

        searchBox.append(
            '<li class="searchBoxChild" id=' + elementId + '>' + data.text + '</li>'
        );

        if (selectedBox) {
            $('#' + elementId).on('click', function(count, key) {
                return function() {
                    selectNode(count, key)
                }
            }(data.count, data.key));
        }
    }

    function selectNode(point, key) {
        var loadedData = {
            key : key,
            id : originData[point].id,
            text : originData[point].text,
            count : point,
        };

        setSelectedTag(loadedData);

        checkedNodes = checkedNodes + loadedData.id + ',';
    }

    function setSelectedTag(loadedData) {
        var key = loadedData.key;
        var id = loadedData.id;
        var text = loadedData.text;
        var count = loadedData.count;
        var elementId = id + key;

        for(i = 0 ; i < selectedBox[0].children.length ; i++){
            if(selectedBox[0].children[i].id === elementId){
                return ;
            }
        }

        selectedBox.append(
            '<li class="label label-default" id=' + 'select' + elementId + ' value=' + id + '>' +
            '<span class="btnSelectedDelete" id= "del' + elementId + '">x</span>' +
            text + '</li>'
        );

        $('#del' +  elementId).on('click', function (count, id, key) {
            return function () {
                deleteNode(count, 'select'+id + key)
            }
        }(count, id, key));
    }

    function deleteNode(point, liId) {
        $('#' + liId).remove();

        checkedNodes = checkedNodes.replace(originData[point].id, '');
    }

    return {
        disable : function (bool) {
            if(bool) {
                searchBar.css('display', 'none');
                searchBox.css('display', 'none');
                selectedBox.css('display', 'none');
            }
        },
        setSearchElement : function (barElement, boxElement, selectedElement) {
            searchBar = barElement;
            searchBox = boxElement;
            selectedBox = selectedElement;

            setEventSearchBar();
        },
        setUniqueKey : function (key) {
            uniqueKey = key;
        },
        setCheckedNodes : function (nodes) {
            checkedNodes = checkedNodes + nodes + ',';
        },
        setSelectedTag : function (data) {
            setSelectedTag(data);
        }
    }
};