About
=====

This project provides a sample Application for creating Live Remote Assets in your account using the Brightcove Media APIs.

Setup
=====
1.	Download the latest 'LiveAPI.zip' file from the Downloads section, extract it and upload it to your web server.

2.	Edit 'liveapi.js' if you would like to change or add preset values.

3.  Ensure that that 'proxy.php' is hosted on a PHP enabled web-server.

4.  Important note: Please ensure that the liveapi.js file is not publically accessible if you choose to preset your Write API Token.

Under the Hood
==============

When you use remote assets for your Video Cloud videos, you must provide all the renditions of the video to be used in delivering it. If you wish the video to be streamed to iOS devices — either because you do not wish to have the video delivered via progressive download under any circumstances, or the video does not meet Apple's requirements for progressive download — you must include HLS renditions as well as MP4 renditions.
Steps for Creating Remote Assets with MP4 and HLS Renditions

You can create both MP4 and HLS renditions for your remote assets using the Media API, but two steps are required:

    Call the create_video method to create the video object and assign MP4 renditions
    Call the update_video method to add an HLS rendition to your video under the videoFullLength property.

Note that these operations do not have to be carried out in immediate sequence — you can add HLS renditions to any multi-bitrate video at any time.

As with all Media API requests, you can use any programming language.
Creating the video and MP4 renditions

    First, create the video with one or more MP4 renditions by making a post request to http://api.brightcove.com/services/post, passing a JSON-RPC object like this:

    {"method":"create_video",
      "params":
        {"token":"[your write token]"}",
         "video":
          {"name":"Live Remote Video",
           "shortDescription":"Your short description",
           "renditions":[
            {"referenceId":"[your reference ID]",
             "remoteUrl":"[URL for this MP4 rendition]",
             "videoDuration":-1,
             "size":0,
             "videoCodec":"ON2",
             "controllerType":"AKAMAI_HD_LIVE"
           } (... other MBR rendition resources) ]
         }
       }
     }

Adding an HLS Rendition

    Make a second API call updating the video created in the previous call setting the videoFullLength property to an HLS rendition — the JSON-RPC object for this call looks like:

    {"method":"update_video",
      "params":
       {"token":"[your write token]",
        "video":
         {"id":'$update_id',
          "videoFullLength":
           {"referenceId":"[your reference ID]",
            "remoteUrl":"[your remote URL]",
            "videoDuration":-1,
            "size":0,
            "videoCodec":"H264",
            "videoContainer":"M2TS",
            "controllerType":"AKAMAI_HD_LIVE"
          }
        }
      }
    }